import AbstractScene from '@/game/scenes/AbstractScene.ts';
import type {Class} from '@/types.ts';
import {Game} from '@/game/managers/GameManager.ts';
import {type Application, Container} from "pixi.js";

export class SceneManager {
    protected sceneContainer: Container<AbstractScene>;
    protected current: Record<string, AbstractScene> = {};
    protected main?: AbstractScene;

    constructor() {
        this.sceneContainer = new Container();

        this.sceneContainer.label = 'GameContainer';
    }

    public init(app: Application): this {
        app.stage.addChild(this.sceneContainer);
        return this;
    }

    public updateCurrent(dt: number): this {
        for (let sceneName in this.current) {
            this.current[sceneName].update(dt);
        }

        return this;
    }

    public load(scene: Class<AbstractScene>, makeMain: boolean = true): this {
        const sceneInstance = new scene();

        this.current[sceneInstance.label] = sceneInstance;

        if (makeMain) {
            if (this.main) this.unload(this.main);
            this.main = sceneInstance;
        }

        this.sceneContainer.addChild(sceneInstance);
        Game.event.emit('sceneLoaded', sceneInstance);

        return this;
    }

    public unload(scene: AbstractScene | string): this {
        if (scene instanceof AbstractScene) scene = scene.label;

        this.sceneContainer.removeChild(this.current[scene]);
        Game.event.emit('sceneUnloaded', this.current[scene]);

        this.current[scene].destroy();
        delete this.current[scene];

        return this;
    }

    public unloadAll(): this {
        for (const [_, scene] of Object.entries(this.current)) {
            this.sceneContainer.removeChild(scene);
            Game.event.emit('sceneUnloaded', scene);
            scene.destroy();
        }

        return this;
    }

    public destroy(): this {
        this.unloadAll();
        this.sceneContainer.destroy(true);
    }
}

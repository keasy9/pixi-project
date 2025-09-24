import AbstractScene from '@/game/scenes/AbstractScene.ts';
import type {Class} from '@/types.ts';
import {Game} from '@/game/managers/GameManager.ts';

export class SceneManager {
    protected current: Record<string, AbstractScene> = {};
    protected main?: AbstractScene;

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

        Game.event.emit('sceneLoad', sceneInstance);

        return this;
    }

    public unload(scene: AbstractScene | string): this {
        if (scene instanceof AbstractScene) scene = scene.label;

        Game.event.emit('sceneUnload', this.current[scene]);

        this.current[scene].destroy();
        delete this.current[scene];

        return this;
    }

    public unloadAll(): this {
        for (const [_, scene] of Object.entries(this.current)) {
            scene.destroy();
        }

        return this;
    }
}

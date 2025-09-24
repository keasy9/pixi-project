import AbstractScene from '@/game/scenes/AbstractScene.ts';
import type {Class} from '@/types.ts';
import {EBus} from '@/systems/EventBus.ts';

class SceneManager {
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

        EBus.emit('sceneLoad', sceneInstance);

        return this;
    }

    public unload(scene: AbstractScene | string): this {
        if (scene instanceof AbstractScene) scene = scene.label;

        EBus.emit('sceneUnload', this.current[scene]);

        this.current[scene].destroy();
        delete this.current[scene];

        return this;
    }
}

export const Scene = new SceneManager();

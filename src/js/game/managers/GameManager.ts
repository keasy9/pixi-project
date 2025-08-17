import type {Application} from 'pixi.js';
import {Scene} from '@/game/managers/SceneManager.ts';
import {EBus} from '@/utils/EventBus.ts';
import Load from '@/game/scenes/Load.ts';
import {TexturePool, TextureSource} from 'pixi.js';

export class GameManager {
    protected app?: Application
    protected ready: boolean = false;
    protected _scale: number = 1;

    public event: typeof EBus;
    public scene: typeof Scene;


    constructor() {
        this.event = EBus;
        this.scene = Scene;
    }

    public get scale(): number {
        return this._scale;
    }

    public isReady(): boolean {
        return this.ready;
    }

    public init(app: Application) {
        this.app = app;

        TextureSource.defaultOptions.scaleMode = 'nearest';

        app.ticker.add(time => {
            Scene.updateCurrent(time.deltaTime);
        });

        EBus.on('sceneLoad', scene => this.app?.stage.addChild(scene));
        EBus.on('sceneUnload', scene => this.app?.stage.removeChild(scene));
        EBus.on('resize', this.resize.bind(this));

        Scene.load(Load);

        this.ready = true;
    }

    public resize(width: number, height: number, scale: number): this {
        this.app?.renderer.resize(width, height);

        this._scale = scale;

        return this;
    }

    public destroy(): void {
        EBus.off('sceneLoad', scene => this.app?.stage.addChild(scene));
        EBus.off('sceneUnload', scene => this.app?.stage.removeChild(scene));
        EBus.off('resize', this.resize.bind(this));

        this.app?.destroy(true);

        this.ready = false;
    }
}

export const Game = new GameManager();
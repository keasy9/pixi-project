import type {Application} from 'pixi.js';
import {Scene} from '@/game/managers/SceneManager.ts';
import {EBus} from '@/systems/EventBus.ts';
import Load from '@/game/scenes/Load.ts';
import {TextureSource} from 'pixi.js';

export const GAME_WIDTH = 128;
export const GAME_HEIGHT = 256;

export class GameManager {
    protected app?: Application
    protected ready: boolean = false;
    protected _scale: number = 1;
    protected _width: number = GAME_WIDTH;
    protected _height: number = GAME_HEIGHT;

    public event: typeof EBus;
    public scene: typeof Scene;

    constructor() {
        this.event = EBus;
        this.scene = Scene;
    }

    public get scale(): number {
        return this._scale;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public isReady(): boolean {
        return this.ready;
    }

    public init(app: Application) {
        this.app = app;

        // debug
        globalThis.__PIXI_APP__ = app;

        this._width = app.renderer.width;
        this._height = app.renderer.height;

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

        this._width = width;
        this._height = height;
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
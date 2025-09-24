import type {Application} from 'pixi.js';
import {Scene} from '@/game/managers/SceneManager.ts';
import {EBus} from '@/systems/EventBus.ts';
import Load from '@/game/scenes/Load.ts';
import {TextureSource} from 'pixi.js';
import InputBinder from '@/systems/Input/InputBinder.ts';

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
    public _input: InputBinder;

    constructor() {
        // todo избавиться от всех синглтонов кроме Game
        this.event = EBus;
        this.scene = Scene;
        this._input = new InputBinder();
    }

    public get input(): InputBinder {
        return this._input;
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

        this._input.on();

        app.ticker.add(time => {
            this.scene.updateCurrent(time.deltaTime);
            this._input.update(time.deltaTime);
        });

        this.event.on('sceneLoad', scene => this.app?.stage.addChild(scene));
        this.event.on('sceneUnload', scene => this.app?.stage.removeChild(scene));
        this.event.on('resize', this.resize.bind(this));

        this.scene.load(Load);

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
        this.event.off('sceneLoad', scene => this.app?.stage.addChild(scene));
        this.event.off('sceneUnload', scene => this.app?.stage.removeChild(scene));
        this.event.off('resize', this.resize.bind(this));

        this.scene.unloadAll();
        this._input.off();

        this.app?.destroy(true);

        this.ready = false;
    }
}

export const Game = new GameManager();
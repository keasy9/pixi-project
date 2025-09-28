import type {Application} from 'pixi.js';
import {SceneManager} from '@/game/managers/SceneManager.ts';
import EventBus from '@/systems/EventBus.ts';
import Load from '@/game/scenes/Load.ts';
import {TextureSource} from 'pixi.js';
import InputBinder from '@/systems/input/InputBinder.ts';
import ExtendedWorld from "@/systems/physics/ExtendedWorld.ts";
import PhysicsDebug from "@/game/scenes/PhysicsDebug.ts";
import LocalStorage from '@/utils/LocalStorage.ts';

export const GAME_WIDTH = 128;
export const GAME_HEIGHT = 256;

export class GameManager {
    protected app?: Application
    protected ready: boolean = false;
    protected _scale: number = 1;
    protected _width: number = GAME_WIDTH;
    protected _height: number = GAME_HEIGHT;

    protected _event: EventBus;
    protected _scene: SceneManager;
    protected _input: InputBinder;
    protected _physicsWorld: ExtendedWorld;
    protected _storage: LocalStorage;

    protected timeStep: number = 1 / 60;
    protected timeStepLimit: number = 6;

    constructor() {
        this._event = new EventBus();
        this._scene = new SceneManager();
        this._input = new InputBinder();
        this._physicsWorld = new ExtendedWorld();
        this._storage = new LocalStorage();
    }

    public get input(): InputBinder {
        return this._input;
    }

    public get event(): EventBus {
        return this._event;
    }

    public get scene(): SceneManager {
        return this._scene;
    }

    public get physics(): ExtendedWorld {
        return this._physicsWorld;
    }

    public get storage(): LocalStorage {
        return this._storage;
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

        this._width = app.renderer.width;
        this._height = app.renderer.height;

        TextureSource.defaultOptions.scaleMode = 'nearest';

        this._input.on();
        this._scene.init(app);

        let timeStepAcc: number = 0;

        let debug: PhysicsDebug|undefined;

        // debug
        if (import.meta.env.DEV) {
            debug = new PhysicsDebug();

            globalThis.__PIXI_APP__ = app;
            app.stage.addChild(debug);
        }

        app.ticker.add(time => {
            timeStepAcc += time.deltaTime;

            let stepsCount = 0;
            while(timeStepAcc >= this.timeStep && stepsCount < this.timeStepLimit) {
                this._physicsWorld.step(this.timeStep);

                timeStepAcc -= this.timeStep;
                stepsCount++;
            }

            this._scene.updateCurrent(time.deltaTime);

            debug?.update();

            this._input.update(time.deltaTime); // всегда обновлять последним!
        });

        this._event.on('resize', this.resize.bind(this));


        this._scene.load(Load);

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
        this._event.off('resize', this.resize.bind(this));

        this._scene.destroy();
        this._input.off();

        this.app?.destroy(true);

        this.ready = false;
    }
}

export const Game = new GameManager();
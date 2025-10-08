import type {World as EcsWorld} from "@lastolivegames/becsy";
import {World} from "planck";
import {Application, Container} from "pixi.js";

type GameConfig = {
    size: [number, number],
    fps?: number, // по умолчанию 1/60
}

// синглтон
export default class Game {
    protected static _instance?: Game;

    protected renderer: Application;
    protected ecsWorld: EcsWorld;
    protected physicsWorld: World;

    protected size: [number, number];
    protected rendererSize: [number, number];
    protected fps: number = 1/60;

    protected graphicsContainer: Container;

    public get graphics(): Container {
        return this.graphicsContainer;
    }

    public get physics(): World {
        return this.physicsWorld;
    }

    public get entities(): EcsWorld {
        return this.ecsWorld;
    }

    public static get instance(): Game {
        if (!this._instance)  throw 'Игра ещё не инициализирована!';
        return this._instance;
    }

    /**
     * Приватный конструктор. Использовать `Game.init(canvas, config)`
     */
    protected constructor(config: GameConfig) {
        this.size = this.rendererSize = config.size;

        if (config.fps) this.fps = config.fps;
    }

    public static init(canvas: HTMLCanvasElement, config: GameConfig): Game {
        if (this._instance)  throw 'Игра уже инициализирована!';

        this._instance = new Game(config);

        this._instance.initPhysics()
            .initRenderer(canvas)
            .initEcs();

        if (import.meta.env.DEV) this._instance.initDebug();
    }

    protected initRenderer(canvas: HTMLCanvasElement): this {
        this.resize(canvas.offsetWidth, canvas.offsetHeight);

        this.renderer = new Application();

        this.renderer.init({
            canvas: canvas,
            width: this.rendererSize[0],
            height: this.rendererSize[1],
            backgroundColor: 0x000000,
            antialias: false,
            resolution: Math.floor(window.devicePixelRatio) || 1,
            autoDensity: true,
            roundPixels: false,
            resizeTo: canvas,
        });

        this.graphicsContainer = new Container();

        this.renderer.stage.addChild(this.graphicsContainer);

        return this;
    }

    protected initPhysics(): this {
        this.physicsWorld = new World();
        return this;
    }

    protected initEcs(): this {
        this.ecsWorld = EcsWorld.create();
        return this;
    }

    protected initDebug(): this {
        globalThis.__PIXI_APP__ = this.renderer;
        return this;
    }

    public static resize(width, height): Game {
        return this._instance?.resize(width, height);
    }

    public resize(width, height): this {
        this.rendererSize = [width, height];
    }

    public destroy(): void {
        this.ecsWorld.terminate();
        this.renderer.destroy();

        for (let b = world.getBodyList(); b; b = b.getNext()) {
            world.destroyBody(b);
        }
    }
}
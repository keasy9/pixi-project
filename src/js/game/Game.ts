import {World as EcsWorld} from "@lastolivegames/becsy";
import {World} from "planck";
import {Application, Container, TextureSource} from 'pixi.js';
import '@/game/systems';

type GameConfig = {
    size: [number, number],
    fps?: number, // по умолчанию 1/60
    maxPhysicsStepsPerFrame?: number, // по-умолчанию 6
}

// синглтон
export default class Game {
    protected static _instance?: Game;

    //@ts-ignore инициализируется в фабричной функции
    protected renderer: Application;
    //@ts-ignore инициализируется в фабричной функции
    protected ecsWorld: EcsWorld;
    //@ts-ignore инициализируется в фабричной функции
    protected physicsWorld: World;

    protected size: [number, number];
    protected rendererSize: [number, number];
    protected fps: number = 1/60;
    protected maxPhysicsStepsPerFrame = 6;

    //@ts-ignore инициализируется в фабричной функции
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
            .initEcs()
            .initRenderer(canvas);

        if (import.meta.env.DEV) this._instance.initDebug();

        return this._instance;
    }

    protected initRenderer(canvas: HTMLCanvasElement): this {
        this.resize(canvas.offsetWidth, canvas.offsetHeight);

        TextureSource.defaultOptions.scaleMode = 'nearest';

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
        }).then(() => this.setupTicker());

        this.graphicsContainer = new Container();

        this.renderer.stage.addChild(this.graphicsContainer);

        return this;
    }

    protected initPhysics(): this {
        this.physicsWorld = new World();
        return this;
    }

    protected initEcs(): this {
        EcsWorld.create().then(wld => this.ecsWorld = wld);
        return this;
    }

    protected initDebug(): this {
        globalThis.__PIXI_APP__ = this.renderer;
        return this;
    }

    protected setupTicker(): this {
        let timeStepAcc = 0;

        this.renderer.ticker.add(async time => {
            timeStepAcc += time.deltaTime;

            let stepsCount = 0;
            while(timeStepAcc >= this.fps && stepsCount < this.maxPhysicsStepsPerFrame) {
                this.physicsWorld.step(this.fps);

                timeStepAcc -= this.fps;
                stepsCount++;
            }

            await this.ecsWorld?.execute(time.elapsedMS, time.deltaTime);
        });

        return this;
    }

    public static resize(width: number, height: number): Game|undefined {
        return this._instance?.resize(width, height);
    }

    public resize(width: number, height: number): this {
        this.rendererSize = [width, height];
        return this;
    }

    /**
     * Уничтожает все составляющие игры (физический мир, ecs-мир, pixi)
     */
    public destroy(): void {
        this.ecsWorld.terminate();
        this.renderer.destroy();

        for (let b = this.physicsWorld.getBodyList(); b; b = b.getNext()) {
            this.physicsWorld.destroyBody(b);
        }

        //@ts-ignore
        this.ecsWorld = undefined;
        //@ts-ignore
        this.renderer = undefined;
        //@ts-ignore
        this.physicsWorld = undefined;
    }
}
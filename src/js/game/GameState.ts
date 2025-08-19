
export enum SCENE {
    LOAD = 'Load',
    MAIN = 'Main',
}

const TARGET_WIDTH = 128;

class GameState {
    // @ts-ignore к моменту когда нужна, уже инициализирована
    protected game: Phaser.Game;
    protected mainScene: SCENE = SCENE.LOAD;
    protected _scale: number = 1;

    public get scene(): Phaser.Scene {
        return this.game.scene.getScene(this.mainScene);
    }

    public get scale(): number {
        return this._scale;
    }

    public init(game: Phaser.Game): this {
        this.game = game;

        return this;
    }

    public playScene(scene: SCENE, asMain: boolean = true): this {
        if (asMain && this.mainScene) {
            this.game.scene.stop(scene);
            this.mainScene = scene;
        }
        this.game.scene.start(scene);

        return this;
    }


    public stopScene(scene: SCENE): this {
        this.game.scene.stop(scene);

        return this;
    }

    public resize(width: number, height: number): void {
        this.game?.scale.resize(width, height);

        this._scale = Math.ceil(width / TARGET_WIDTH);

        this.game?.events.emit('resize', this.scale);
    }

    public destroy(): void {
        this.game?.destroy(false);

        //@ts-ignore
        delete this.game;
    }
}

export const Game = new GameState();
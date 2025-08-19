
export enum SCENE {
    LOAD = 'Load',
    MAIN = 'Main',
}

class GameState {
    // @ts-ignore к моменту когда нужна, уже инициализирована
    public game: Phaser.Game;
    protected mainScene: SCENE = SCENE.LOAD;

    public get scene(): Phaser.Scene {
        return this.game.scene.getScene(this.mainScene);
    }

    public init(game: Phaser.Game): this {
        this.game = game;


        return this;
    }

    public loadScene(scene: SCENE, asMain: boolean = true): this {
        if (asMain && this.mainScene) {
            this.game.scene.stop(scene);
            this.mainScene = scene;
        }
        this.game.scene.start(scene);

        return this;
    }


    public unloadScene(scene: SCENE): this {
        this.game.scene.stop(scene);

        return this;
    }
}

export const Game = new GameState();
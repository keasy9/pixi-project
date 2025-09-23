import Player from '@/game/objects/Player.ts';
import AbstractScene from '@/game/scenes/AbstractScene.ts';
import {Game} from '@/game/managers/GameManager';

// todo rewrite
export default class Main extends AbstractScene {
    protected player?: Player;

    constructor ()
    {
        super('main');

        this.player = new Player(Game.width * .5, Game.height * .9);

        this.addChild(this.player);
    }
}
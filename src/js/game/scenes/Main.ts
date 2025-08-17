import {SCENE_MAIN} from '@/const.ts';
import ParallaxBg from '@/game/objects/ParallaxBg.ts';
import Player from '@/game/objects/Player.ts';

export default class Main extends Phaser.Scene {
    constructor ()
    {
        super(SCENE_MAIN);
    }

    create()
    {
        this.add.existing(new ParallaxBg(this));
        this.add.existing(new Player(this, this.cameras.main.width / 2, this.cameras.main.height * .9));
    }
}
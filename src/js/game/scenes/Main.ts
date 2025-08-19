import ParallaxBg from '@/game/objects/ParallaxBg.ts';
import Player from '@/game/objects/player/Player.ts';
import {SCENE} from '@/game/GameState';

export default class Main extends Phaser.Scene {
    protected player?: Player;
    protected bg?: ParallaxBg;

    constructor ()
    {
        super(SCENE.MAIN);
    }

    public create()
    {
        this.bg = new ParallaxBg(this);
        this.player = new Player(this, this.cameras.main.width / 2, this.cameras.main.height * .9);

        this.add.existing(this.bg);
        this.add.existing(this.player);
    }

    public update(time: number, delta: number) {
        super.update(time, delta);

        if (this.player && this.bg) {
            const center = this.cameras.main.width / 2;
            const offset = Math.floor(center - this.player.x);

            this.bg.setHorizontalOffset(offset);

            this.bg.setSpeed(3);

            const verticalVelocity = this.player.getVelocity().y;
            if (verticalVelocity < 0) {
                this.bg.setSpeed(5);
            } else if (verticalVelocity > 0) {
                this.bg.setSpeed(2);
            }
        }
    }
}
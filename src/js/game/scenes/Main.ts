import ParallaxBg from '@/game/objects/ParallaxBg.ts';
import Player from '@/game/objects/Player.ts';
import AbstractScene from '@/game/scenes/AbstractScene.ts';

// todo rewrite
export default class Main extends AbstractScene {
    protected player?: Player;
    protected bg?: ParallaxBg;

    constructor ()
    {
        super('main');
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

            this.bg.setSpeed(5);

            const verticalVelocity = this.player.getVelocity().y;
            if (verticalVelocity < 0) {
                this.bg.setSpeed(6);
            } else if (verticalVelocity > 0) {
                this.bg.setSpeed(4);
            }
        }
    }
}
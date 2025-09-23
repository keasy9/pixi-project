import ParallaxBg from '@/game/objects/ParallaxBg.ts';
import Player from '@/game/objects/player/Player.ts';
import {SCENE} from '@/game/GameState';
import {COLLIDER, Collider} from '@/game/managers/CollisionManager';
import LevelManager from '@/game/managers/LevelManager';

export default class Main extends Phaser.Scene {
    protected player?: Player;
    protected bg?: ParallaxBg;
    protected level: LevelManager;

    constructor ()
    {
        super(SCENE.MAIN);

        this.level = new LevelManager(this);
    }

    public create()
    {
        this.bg = new ParallaxBg(this);
        this.player = new Player(this, this.cameras.main.width / 2, this.cameras.main.height * .9);

        this.add.existing(this.bg);
        this.add.existing(this.player);

        //Collider.add(this.player, COLLIDER.PLAYER);

        //this.level.load(1).then(level => level.start());
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
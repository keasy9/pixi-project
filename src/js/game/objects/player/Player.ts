import Vector2 = Phaser.Math.Vector2;
import Ship from '@/game/objects/player/Ship';
import {Exhaust, EXHAUST_SIZE} from '@/game/objects/player/Exhaust';

export default class Player extends Phaser.GameObjects.Container {
    protected cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    protected ship: Ship;
    protected exhaust: Exhaust[] = [];

    protected speed = .4;

    constructor(scene: Phaser.Scene, x: number, y :number) {
        super(scene, x, y);

        this.ship = new Ship(scene, 0, 0);
        this.add(this.ship);


        const exhaust = new Exhaust(scene, 0, 0, EXHAUST_SIZE.DOUBLE);
        this.add(exhaust.setPosition(1, 5));


        this.setSize(this.ship.displayWidth, this.ship.displayHeight);
        scene.physics.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);


        this.setScale(scene.game.registry.get('gameScale'));


        this.cursors = scene.input.keyboard?.createCursorKeys();
    }

    protected preUpdate(_time: number, _dt: number) {
        const body = this.body as Phaser.Physics.Arcade.Body;

        const velocity = new Vector2(0, 0);

        if (this.cursors) {

            if (this.cursors.left.isDown) {
                velocity.x = -1;
                this.ship.toLeft();

            } else if (this.cursors.right.isDown) {
                velocity.x = 1;
                this.ship.toRight();

            } else {
                this.ship.toMain();
            }

            if (this.cursors.up.isDown) velocity.y = -1;
            else if (this.cursors.down.isDown) velocity.y = 1;

            velocity.normalize().scale(this.scene.cameras.main.width * this.speed);
        }

        body.setVelocity(velocity.x, velocity.y);
    }

    public getVelocity(): Vector2
    {
        return (this.body as Phaser.Physics.Arcade.Body).velocity;
    }
}
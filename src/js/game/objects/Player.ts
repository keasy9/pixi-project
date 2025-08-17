import {SPRITE_SHIPS} from '@/const.ts';
import Vector2 = Phaser.Math.Vector2;

export default class Player extends Phaser.GameObjects.Container {
    protected cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    protected shipSprite: Phaser.GameObjects.Sprite;

    protected speed = .4;
    protected shipSpriteBaseFrame = 13;

    constructor(scene: Phaser.Scene, x: number, y :number) {
        super(scene, x, y);

        const scale = scene.game.registry.get('gameScale');

        this.shipSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, SPRITE_SHIPS, this.shipSpriteBaseFrame);
        this.shipSprite.setDisplaySize(this.shipSprite.width * scale, this.shipSprite.height * scale);

        this.setSize(this.shipSprite.displayWidth, this.shipSprite.displayHeight);

        this.add(this.shipSprite);

        this.cursors = scene.input.keyboard?.createCursorKeys();

        scene.physics.add.existing(this);

        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
    }

    protected preUpdate(_time: number, _dt: number) {
        const body = this.body as Phaser.Physics.Arcade.Body;

        const velocity = new Vector2(0, 0);

        if (this.cursors) {

            if (this.cursors.left.isDown) {
                velocity.x = -1;
                this.shipSprite.setFrame(this.shipSpriteBaseFrame - 1);

            } else if (this.cursors.right.isDown) {
                velocity.x = 1;
                this.shipSprite.setFrame(this.shipSpriteBaseFrame + 1);

            } else {
                this.shipSprite.setFrame(this.shipSpriteBaseFrame);
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
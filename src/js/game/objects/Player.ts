import {SPRITE_SHIPS} from '@/const.ts';

export default class Player extends Phaser.GameObjects.Container {
    protected cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    protected shipSprite: Phaser.GameObjects.Sprite;

    protected speed = 100;
    protected shipSpriteBaseFrame = 13;

    constructor(scene: Phaser.Scene, x: number, y :number) {
        super(scene, x, y);

        const scale = scene.game.registry.get('gameScale');

        this.shipSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, SPRITE_SHIPS, this.shipSpriteBaseFrame);
        this.shipSprite.setDisplaySize(this.shipSprite.width * scale, this.shipSprite.height * scale);

        this.add(this.shipSprite);

        this.cursors = scene.input.keyboard?.createCursorKeys();

        scene.physics.add.existing(this.shipSprite);
    }

    protected preUpdate(_time: number, _dt: number) {
        const body = this.shipSprite.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0, 0);

        if (this.cursors) {
            if (this.cursors.left.isDown) {
                body.setVelocityX(-this.speed);
                this.shipSprite.setFrame(this.shipSpriteBaseFrame - 1);

            } else if (this.cursors.right.isDown) {
                body.setVelocityX(this.speed);
                this.shipSprite.setFrame(this.shipSpriteBaseFrame + 1);

            } else {
                this.shipSprite.setFrame(this.shipSpriteBaseFrame);
            }

            if (this.cursors.up.isDown) body.setVelocityY(-this.speed);
            else if (this.cursors.down.isDown) body.setVelocityY(this.speed);
        }
    }
}
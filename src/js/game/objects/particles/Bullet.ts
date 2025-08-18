import {SPRITE_BULLETS} from '@/const.ts';

// значение - фрейм в спрайте
export enum BULLET_TYPE {
    BLUE = 0,
    CYAN = 1,
    PLUNGER = 2,
    RED = 3,
    GREEN = 4,
    CROSS = 5,
    PURPLE = 6,
    BRICK = 7,
    STICK = 8,
    SMALL = 9,
    TINY = 10,
    ROCKET = 11,
    BALL = 12,
    RING = 13,
}

export class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, type: BULLET_TYPE) {
        super(scene, x, y, SPRITE_BULLETS, type);

        this.setScale(scene.game.registry.get('gameScale'));
    }
}
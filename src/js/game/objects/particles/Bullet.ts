import {SPRITE_BULLETS} from '@/const.ts';
import Point = Phaser.Geom.Point;
import VariableSprite from '@/game/objects/abstract/VariableSprite.ts';

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

type TFireOptions = {
    angle?: number,
    speed?: number,
}

const DEFAULT_ANGLE = 0;
const DEFAULT_SPEED = 800;

export class Bullet extends VariableSprite<BULLET_TYPE> {
    constructor(scene: Phaser.Scene, x: number, y: number, variant: BULLET_TYPE = BULLET_TYPE.STICK) {
        super(scene, x, y, variant);
    }

    protected getTextureKey(): string {
        return SPRITE_BULLETS;
    }

    protected getSizesMap() {
        return {
            [BULLET_TYPE.BRICK]:  {width: 2, height: 3},
            [BULLET_TYPE.STICK]:  {width: 1, height: 3},
            [BULLET_TYPE.SMALL]:  {width: 1, height: 2},
            [BULLET_TYPE.TINY]:   {width: 1, height: 1},
            [BULLET_TYPE.CROSS]:  {          height: 5},
            [BULLET_TYPE.ROCKET]: {          height: 4},
            [BULLET_TYPE.BALL]:   {          height: 3},
            [BULLET_TYPE.PURPLE]: {          height: 2},
        };
    }

    public fire(options?: TFireOptions): this {
        const angle = options?.angle ?? DEFAULT_ANGLE;
        const speed = options?.speed ?? DEFAULT_SPEED;

        this.setRotation(Phaser.Math.DegToRad(angle));

        const velocity = Phaser.Math.Rotate(new Point(speed, 0), Phaser.Math.DegToRad(this.rotation - 90));

        (this.body as Phaser.Physics.Arcade.Body).setVelocity(velocity.x, velocity.y);

        return this;
    }
}
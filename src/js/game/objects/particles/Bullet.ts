import {SPRITE_BULLETS} from '@/const.ts';
import Point = Phaser.Geom.Point;
import {Game} from '@/game/GameState';

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

export class Bullet extends Phaser.GameObjects.Sprite {
    public speed: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, bulletType: BULLET_TYPE = BULLET_TYPE.STICK) {
        super(scene, x, y, SPRITE_BULLETS, bulletType);

        this.setScale(Game.scale);

        scene.physics.add.existing(this);

        this.correctBody(bulletType);
    }

    //@ts-ignore используется в пуле объектов
    public set bulletType(bulletType: BULLET_TYPE): void {
        this.setFrame(bulletType, true, true);
        this.correctBody(bulletType);
    }

    protected correctBody(type: BULLET_TYPE): void {

        const defaultWidth = 3;
        const typesWidth: {[K in BULLET_TYPE]?: number} = {
            [BULLET_TYPE.BRICK]: 2,
            [BULLET_TYPE.STICK]: 1,
            [BULLET_TYPE.SMALL]: 1,
            [BULLET_TYPE.TINY]: 1,
        };

        const defaultHeight = 6;
        const typesHeight: {[K in BULLET_TYPE]?: number} = {
            [BULLET_TYPE.CROSS]: 5,
            [BULLET_TYPE.ROCKET]: 4,
            [BULLET_TYPE.BRICK]: 3,
            [BULLET_TYPE.STICK]: 3,
            [BULLET_TYPE.BALL]: 3,
            [BULLET_TYPE.PURPLE]: 2,
            [BULLET_TYPE.SMALL]: 2,
            [BULLET_TYPE.TINY]: 1,
        };

        (this.body as Phaser.Physics.Arcade.Body).setSize(
            typesWidth[type] ?? defaultWidth,
            typesHeight[type] ?? defaultHeight,
        ).setOffset(0, 0);
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
import VariableSprite from '@/game/objects/abstract/VariableSprite';
import {SPRITE_ENEMIES} from '@/const';
import type {TSize} from '@/utils/Types';
import type {DamageProvider, DamageTaker, Mortal} from '@/game/objects/Types';

// значение - фрейм в спрайте
export enum ENEMY_TYPE {
    WHITE = 0,
    FORK = 1,
    TRIDENT = 2,
    OCEAN = 4,
    GRASS = 5,
    CRAB = 6,
    DARK = 7,
    GIRL = 8,
    PEAK = 9,
    SUN = 10,
    SPOON = 11,
    TINY = 12,
    TREE = 13,
    WOMAN = 14,
    STAR = 15,
    ROCKET = 16,
    BROWN = 17,
    BALL = 18,
    WEDGE = 19,
    FOOT = 20,
    HANDSOME = 21,
    FISH = 22,
    KNUCKLE = 23,
    DROP = 24,
    DEVIL = 25,
    GOAT = 26,
    BEETLE = 27,
    GRIG = 28,
    PUDDLE = 29,
    HUGGER = 30,
    SEA = 31,
    HEAD = 32,
    HASHER = 33,
    GRIP = 34,
    BUTT = 35,
    GLIDER = 36,
}

export default class Enemy extends VariableSprite<ENEMY_TYPE> implements DamageTaker, Mortal, DamageProvider {
    declare body: Phaser.Physics.Arcade.Body;

    public static readonly SIZE_IN_GRID: number = 8;

    protected health: number = 10;

    constructor(scene: Phaser.Scene, x: number, y: number, variant: ENEMY_TYPE = ENEMY_TYPE.WHITE) {
        super(scene, x, y, variant);

        this.body.checkCollision.none = true;
    }

    protected getTextureKey(): string {
        return SPRITE_ENEMIES;
    }

    protected getSizesMap(): { [K in ENEMY_TYPE]?: Partial<TSize> } {
        return {
            [ENEMY_TYPE.WHITE]:    {width: 5, height: 5},
            [ENEMY_TYPE.FORK]:     {width: 7, height: 5},
            [ENEMY_TYPE.TRIDENT]:  {width: 5, height: 6},
            [ENEMY_TYPE.OCEAN]:    {width: 6, height: 4},
            [ENEMY_TYPE.GRASS]:    {width: 5, height: 4},
            [ENEMY_TYPE.CRAB]:     {width: 7, height: 5},
            [ENEMY_TYPE.DARK]:     {width: 5, height: 4},
            [ENEMY_TYPE.GIRL]:     {width: 6, height: 4},
            [ENEMY_TYPE.PEAK]:     {width: 5, height: 5},
            [ENEMY_TYPE.SUN]:      {width: 6, height: 5},
            [ENEMY_TYPE.SPOON]:    {width: 6, height: 5},
            [ENEMY_TYPE.TINY]:     {width: 4, height: 5},
            [ENEMY_TYPE.TREE]:     {width: 7, height: 6},
            [ENEMY_TYPE.STAR]:     {width: 6, height: 6},
            [ENEMY_TYPE.ROCKET]:   {width: 5, height: 6},
            [ENEMY_TYPE.BALL]:     {width: 6, height: 5},
            [ENEMY_TYPE.WEDGE]:    {width: 6, height: 6},
            [ENEMY_TYPE.FOOT]:     {width: 6, height: 6},
            [ENEMY_TYPE.HANDSOME]: {width: 6, height: 6},
            [ENEMY_TYPE.FISH]:     {width: 5, height: 6},
            [ENEMY_TYPE.KNUCKLE]:  {width: 6, height: 5},
            [ENEMY_TYPE.PUDDLE]:   {width: 6, height: 6},
            [ENEMY_TYPE.HASHER]:   {width: 6, height: 6},
            [ENEMY_TYPE.GRIP]:     {width: 6, height: 6},
            [ENEMY_TYPE.BUTT]:     {width: 6, height: 6},
            [ENEMY_TYPE.WOMAN]:    {height: 6},
            [ENEMY_TYPE.BROWN]:    {height: 5},
            [ENEMY_TYPE.DROP]:     {height: 6},
            [ENEMY_TYPE.GRIG]:     {height: 7},
            [ENEMY_TYPE.HUGGER]:   {height: 6},
            [ENEMY_TYPE.SEA]:      {height: 6},
            [ENEMY_TYPE.GLIDER]:   {height: 7},
            [ENEMY_TYPE.HEAD]:     {width: 6},
        };
    }

    public takeDamage(damage: number): void {
        this.health -= damage;
        this.health = Math.max(this.health, 0);
    }

    public get dead(): boolean {
        return this.health <= 0;
    }

    public get damage(): number {
        return 10;
    }
}
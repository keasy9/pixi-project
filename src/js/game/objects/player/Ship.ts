import {SPRITE_SHIPS} from '@/const';

// значение - основной фрейм спрайта для корабля определённого типа
export enum SHIP_TYPE {
    WHITE = 1,
    YELLOW = 4,
    GREEN = 7,
    PINK = 10,
    RED = 13,
}

export default class Ship extends Phaser.GameObjects.Sprite {
    protected rightFrame: number;
    protected leftFrame: number;

    constructor(scene: Phaser.Scene, x: number, y: number, protected mainFrame: SHIP_TYPE = SHIP_TYPE.WHITE) {
        super(scene, x, y, SPRITE_SHIPS, mainFrame);

        this.rightFrame = mainFrame + 1;
        this.leftFrame = mainFrame - 1;

        this.setOrigin(0, 0);
    }

    public toLeft(): this
    {
        this.setFrame(this.leftFrame);

        return this;
    }

    public toRight(): this
    {
        this.setFrame(this.rightFrame);

        return this;
    }

    public toMain(): this {
        this.setFrame(this.mainFrame);

        return this;
    }
}
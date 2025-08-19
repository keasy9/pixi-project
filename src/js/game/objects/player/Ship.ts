import {SPRITE_SHIPS} from '@/const';
import VariableSprite from '@/game/objects/VariableSprite.ts';

// значение - основной фрейм спрайта для корабля определённого типа
export enum SHIP_VARIANT {
    WHITE = 1,
    YELLOW = 4,
    GREEN = 7,
    PINK = 10,
    RED = 13,
}

export default class Ship extends VariableSprite<SHIP_VARIANT> {

    protected rightFrame: number;
    protected leftFrame: number;

    constructor(scene: Phaser.Scene, x: number, y: number, protected mainFrame: SHIP_VARIANT = SHIP_VARIANT.WHITE) {
        super(scene, x, y, mainFrame, false, false);

        this.rightFrame = mainFrame + 1;
        this.leftFrame = mainFrame - 1;
    }

    protected getTextureKey(): string {
        return SPRITE_SHIPS;
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
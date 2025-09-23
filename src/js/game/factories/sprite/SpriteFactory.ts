import {SpriteDecorator} from "@/game/factories/sprite/SpriteDecorator.ts";
import {Texture, Assets} from "pixi.js";

export enum SpriteSheet {
    Ships = 'ships',
    Exhausts = 'exhausts',
}

export class SpriteFactory {
    protected static create(spriteSheet: SpriteSheet): SpriteDecorator {
        const texture = Assets.get(spriteSheet);
        if (!texture) throw `Спрайт [${spriteSheet}] не загружен!`;
        if (!(texture instanceof Texture)) throw `Ассет [${spriteSheet}] не является текстурой!`;

        return new SpriteDecorator(texture);
    }

    public static createPlayerShip(type: 1|2|3|4|5): SpriteDecorator {
        type--;

        return this.create(SpriteSheet.Ships)
            .withFrames()
            .size(8)
            .from(0, type)
            .to(2, type)
            .slice()
            .toFrame(1);
    }
}
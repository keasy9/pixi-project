import {Sprite} from "@/game/factories/sprite/Sprite.ts";
import {Texture, Assets} from "pixi.js";
import {FramesBuilder} from "@/game/factories/frame/FramesBuilder.ts";

export enum SpriteSheet {
    Ships = 'ships',
    Exhausts = 'exhausts',
    Space = 'space',
}

export class SpriteFactory {
    protected static getTexture(spriteSheet: SpriteSheet): Texture {
        const texture = Assets.get(spriteSheet);
        if (!texture) throw `Спрайт [${spriteSheet}] не загружен!`;
        if (!(texture instanceof Texture)) throw `Ассет [${spriteSheet}] не является текстурой!`;

        return texture;
    }

    protected static create(spriteSheet: SpriteSheet): Sprite {
        return new Sprite(this.getTexture(spriteSheet));
    }

    protected static builder(spriteSheet: SpriteSheet): FramesBuilder {
        return new FramesBuilder(this.getTexture(spriteSheet));
    }

    public static createPlayerShip(type: 1|2|3|4|5 = 1): Sprite {
        type--;

        return this.create(SpriteSheet.Ships)
            .withFrames()
            .size(8)
            .from(0, type)
            .to(2, type)
            .slice()
            .goto(1);
    }

    public static createExhaust(size: 1|2|3 = 1, type: 1|2 = 1): Sprite {
        size--;

        return this.create(SpriteSheet.Exhausts)
            .withFrames()
            .size(4, 5)
            .from((type-1) * 4, size)
            .to((type * 4) - 1, size)
            .slice()
            .animate(10 / 60);
    }

    public static createSpace(): Sprite[] {
        return this.builder(SpriteSheet.Space)
            .size(128, 256)
            .slice()
            .map(texture => new Sprite(texture))
    }
}
import {ExtendedSprite} from "@/game/factories/sprite/ExtendedSprite.ts";
import {Texture, Assets} from "pixi.js";
import {FramesBuilder} from "@/game/factories/frame/FramesBuilder.ts";

export enum SpriteSheet {
    Ships = 'ships',
    Exhausts = 'exhausts',
    Space = 'space',
    Enemies = 'enemies',
}

const enemySprites: Record<number, [number, number]> = {
    // frame: [width, height]
    1: [5, 5],
    2: [7, 5],
    3: [5, 5],
    4: [6, 4],
    5: [5, 4],
    6: [7, 5],
    7: [6, 4],
    8: [6, 4],
    9: [5, 5],
    10: [6, 5],
    11: [6, 5],
    12: [4, 5],
    13: [7, 6],
    14: [8, 6],
    15: [6, 6],
    16: [6, 5],
    17: [8, 5],
    18: [6, 5],
    19: [6, 6],
    20: [6, 6],
    21: [6, 6],
    22: [5, 6],
    23: [6, 5],
    24: [8, 6],
    25: [8, 8],
    26: [8, 8],
    27: [8, 8],
    28: [8, 7],
    29: [6, 6],
    30: [8, 6],
    31: [8, 6],
    32: [6, 8],
    33: [6, 6],
    34: [6, 6],
    35: [6, 6],
    36: [8, 7],
}

export class SpriteFactory {
    protected static getTexture(spriteSheet: SpriteSheet): Texture {
        const texture = Assets.get(spriteSheet);
        if (!texture) throw `Спрайт [${spriteSheet}] не загружен!`;
        if (!(texture instanceof Texture)) throw `Ассет [${spriteSheet}] не является текстурой!`;

        return texture;
    }

    protected static sprite(spriteSheet: SpriteSheet): ExtendedSprite {
        return new ExtendedSprite(this.getTexture(spriteSheet));
    }

    protected static frames(spriteSheet: SpriteSheet): FramesBuilder {
        return new FramesBuilder(this.getTexture(spriteSheet));
    }

    public static createPlayerShip(type: 1|2|3|4|5 = 1): ExtendedSprite {
        type--;

        return this.sprite(SpriteSheet.Ships)
            .withFrames()
            .size(8)
            .from(0, type)
            .to(2, type)
            .slice()
            .goto(1);
    }

    public static createExhaust(size: 1|2|3 = 1, type: 1|2 = 1): ExtendedSprite {
        size--;

        return this.sprite(SpriteSheet.Exhausts)
            .withFrames()
            .size(4, 5)
            .from((type-1) * 4, size)
            .to((type * 4) - 1, size)
            .slice()
            .animate(10 / 60);
    }

    public static createSpace(): ExtendedSprite[] {
        return this.frames(SpriteSheet.Space)
            .size(128, 256)
            .slice()
            .map(texture => new ExtendedSprite(texture))
    }

    public static createEnemy(type: keyof typeof enemySprites): ExtendedSprite {
        return this.sprite(SpriteSheet.Enemies)
            .withFrames()
            .size(...enemySprites[type])
            .one();
    }
}
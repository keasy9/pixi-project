import {ExtendedSprite} from "@/game/factories/sprite/ExtendedSprite.ts";
import {Texture, Assets} from "pixi.js";
import {FramesBuilder} from "@/game/factories/frame/FramesBuilder.ts";
import type Enemy from "@/game/objects/Enemy.ts";
import type {EnemyType} from "@/game/managers/level/types/wave.ts";

export enum SpriteSheet {
    Ships = 'ships',
    Exhausts = 'exhausts',
    Space = 'space',
    Enemies = 'enemies',
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
            .from((type - 1) * 4, size)
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

    public createEnemy(type: EnemyType): Enemy {
        // todo?
    }
}
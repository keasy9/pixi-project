import {ExtendedSprite} from "@/game/factories/sprite/ExtendedSprite.ts";
import {Texture, Assets} from "pixi.js";
import {FramesBuilder} from "@/game/factories/frame/FramesBuilder.ts";
import Enemy from "@/game/objects/Enemy.ts";
import {EnemyType} from "@/game/managers/level/types/wave.ts";
import type {Class} from '@/types.ts';

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

    //@ts-ignore
    protected static sprite<T extends ExtendedSprite = ExtendedSprite>(spriteSheet: SpriteSheet, spriteClass: Class<T> = ExtendedSprite): T {
        return new spriteClass(this.getTexture(spriteSheet));
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

    public static createEnemy(type: EnemyType): Enemy {
        return this.sprite(SpriteSheet.Enemies, Enemy)
            .withFrames()
            .size(8, 8)
            .slice()
            .goto(type) as unknown as  Enemy
    }
}
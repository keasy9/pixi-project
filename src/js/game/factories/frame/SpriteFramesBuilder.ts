import type {ExtendedSprite} from "@/game/factories/sprite/ExtendedSprite.ts";
import {FramesBuilder} from "@/game/factories/frame/FramesBuilder.ts";
import type {Texture} from 'pixi.js';

export class SpriteFramesBuilder extends FramesBuilder {
    constructor(spriteSheet: Texture, protected sprite: ExtendedSprite) {
        super(spriteSheet);
    }

    //@ts-ignore
    public slice(): ExtendedSprite {
        return this.sprite.setFrames(super.slice());
    }

    //@ts-ignore
    public one(): ExtendedSprite {
        return this.sprite.setFrames([super.one()]);
    }
}
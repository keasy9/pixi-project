import type {ExtendedSprite} from "@/game/factories/sprite/ExtendedSprite.ts";
import {FramesBuilder} from "@/game/factories/frame/FramesBuilder.ts";

export class SpriteFramesBuilder extends FramesBuilder {
    constructor(spriteSheet: Texture, protected sprite: ExtendedSprite) {
        super(spriteSheet);
    }

    public slice(): ExtendedSprite {
        return this.sprite.setFrames(super.slice());
    }
}
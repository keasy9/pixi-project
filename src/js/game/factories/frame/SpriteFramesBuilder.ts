import type {SpriteDecorator} from "@/game/factories/sprite/SpriteDecorator.ts";
import {FramesBuilder} from "@/game/factories/frame/FramesBuilder.ts";

export class SpriteFramesBuilder extends FramesBuilder {
    constructor(spriteSheet: Texture, protected sprite: SpriteDecorator) {
        super(spriteSheet);
    }

    public slice(): SpriteDecorator {
        return this.sprite.setFrames(super.slice());
    }
}
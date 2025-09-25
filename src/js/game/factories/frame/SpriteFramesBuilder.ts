import type {Sprite} from "@/game/factories/sprite/Sprite.ts";
import {FramesBuilder} from "@/game/factories/frame/FramesBuilder.ts";

export class SpriteFramesBuilder extends FramesBuilder {
    constructor(spriteSheet: Texture, protected sprite: Sprite) {
        super(spriteSheet);
    }

    public slice(): Sprite {
        return this.sprite.setFrames(super.slice());
    }
}
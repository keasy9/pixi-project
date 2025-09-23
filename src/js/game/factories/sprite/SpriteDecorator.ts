import {Sprite, type Texture} from 'pixi.js';
import {SpriteFramesBuilder} from "@/game/factories/frame/SpriteFramesBuilder.ts";

export class SpriteDecorator extends Sprite {
    protected frames: Texture[];

    public constructor(protected spriteSheet?: Texture) {
        super(spriteSheet);
    }

    public setFrames(frames: Texture[]): this {
        this.frames = frames;

        return this.toFrame(0);
    }

    public withFrames(): SpriteFramesBuilder
    {
        if (!this.spriteSheet) throw 'У этого спрайта нет текстуры!';
        return new SpriteFramesBuilder(this.spriteSheet, this);
    }

    public toFrame(frame: number): this {
        if (this.frames.length <= frame) throw `У этого спрайта нет [${frame}] кадра!`;

        this.texture = this.frames[frame];
        return this;
    }
}
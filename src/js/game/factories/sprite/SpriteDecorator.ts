import {AnimatedSprite, Sprite, type Texture} from 'pixi.js';
import {SpriteFramesBuilder} from "@/game/factories/frame/SpriteFramesBuilder.ts";
import {Game} from "@/game/managers/GameManager.ts";
import {EBus} from "@/utils/EventBus.ts";

export class SpriteDecorator extends AnimatedSprite {
    protected mainFrames: Texture[];

    public constructor(protected spriteSheet?: Texture) {
        super([spriteSheet]);

        this.stop();

        this.scale.set(Game.scale);
        EBus.on('resize', (_w, _h, scale) => this.scale.set(scale));
    }

    public setFrames(frames: Texture[]): this {
        this.mainFrames = this.textures = frames;

        return this.toFrame(0);
    }

    public withFrames(): SpriteFramesBuilder
    {
        if (!this.spriteSheet) throw 'У этого спрайта нет текстуры!';
        return new SpriteFramesBuilder(this.spriteSheet, this);
    }

    public toFrame(frame: number): this {
        if (this.mainFrames.length <= frame) throw `У этого спрайта нет [${frame}] кадра!`;

        this.texture = this.mainFrames[frame];
        return this;
    }

    public place(x: number = 0, y: number = 0): this {
        this.x = x * Game.scale;
        this.y = y * Game.scale;

        return this;
    }

    public animate(speed: number): this {
        this.animationSpeed = speed;
        this.play();

        return this;
    }
}

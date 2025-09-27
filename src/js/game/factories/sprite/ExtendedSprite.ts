import {AnimatedSprite, type Texture} from 'pixi.js';
import {SpriteFramesBuilder} from "@/game/factories/frame/SpriteFramesBuilder.ts";
import {Game} from "@/game/managers/GameManager.ts";

export class ExtendedSprite extends AnimatedSprite {
    protected mainFrames: Texture[] = []; // потенциал для нескольких анимаций в одном спрайте

    public constructor(protected spriteSheet: Texture) {
        super([spriteSheet]);

        this.stop();

        this.scale.set(Game.scale);
        Game.event.on('resize', (_w, _h, scale) => this.scale.set(scale));
    }

    public setFrames(frames: Texture[]): this {
        this.mainFrames = this.textures = frames;

        return this.goto(0);
    }

    public withFrames(): SpriteFramesBuilder
    {
        if (!this.spriteSheet) throw 'У этого спрайта нет текстуры!';
        return new SpriteFramesBuilder(this.spriteSheet, this);
    }

    public goto(frame: number): this {
        if (this.playing) this.gotoAndPlay(frame);
        else this.gotoAndStop(frame);

        return this;
    }

    public skip(frames: number): this {
        let target = this.currentFrame + frames;
        while (target >= this.textures.length) {
            target -= this.textures.length;
        }

        this.goto(target);

        return this;
    }

    public moveRelative(x: number = 0, y: number = 0): this {
        this.x = x * Game.scale;
        this.y = y * Game.scale;

        return this;
    }

    public move(x: number = 0, y: number = 0): this {
        this.x = x;
        this.y = y;

        return this;
    }

    public animate(speed: number): this {
        this.animationSpeed = speed;
        this.play();

        return this;
    }

    public clone(syncPlaying: boolean = true, syncFrames: boolean = false): ExtendedSprite {
        const clone = new ExtendedSprite(this.spriteSheet)
            .setFrames(this.mainFrames.length ? this.mainFrames : [this.spriteSheet]);

        if (syncPlaying && this.playing) clone.animate(this.animationSpeed);
        if (syncFrames) clone.goto(this.currentFrame);

        return clone;
    }
}

import {Rectangle, Texture} from "pixi.js";

export class FramesBuilder {
    protected frameWidth: number = 0;
    protected frameHeight: number = 0;
    protected startFrame: [number, number] = [0, 0];
    protected endFrame?: [number, number] = null;

    public constructor(protected spriteSheet: Texture) {}

    public size(width: number, height?: number): this {
        this.frameWidth = width;
        this.frameHeight = height ?? width;

        return this;
    }

    public from(xIndex: number, yIndex: number): this {
        this.startFrame = [xIndex, yIndex];
        return this;
    }

    public fromStart(): this {
        this.startFrame = [0, 0];
        return this;
    }

    public to(xIndex: number, yIndex: number): this {
        this.endFrame = [xIndex, yIndex];
        return this;
    }

    public toEnd(): this {
        this.endFrame = null;
        return this;
    }

    public slice(): Texture[] {
        const frames: Texture[] = [];

        const maxWidth = this.endFrame ? this.endFrame[0] * this.frameWidth : this.spriteSheet.width;
        const maxHeight = this.endFrame ? this.endFrame[1] * this.frameHeight : this.spriteSheet.height;

        for (let j = this.startFrame[1] * this.frameHeight; j < this.spriteSheet.height; j += this.frameHeight) {
            for (let i = this.startFrame[0] * this.frameWidth; i < this.spriteSheet.width; i += this.frameWidth) {
                // todo пулл фреймов
                frames.push(new Texture({
                    source: this.spriteSheet,
                    frame: new Rectangle(i, j, this.frameWidth, this.frameHeight),
                }));
                if (j > maxHeight && i > maxWidth) return frames;
            }
        }

        return frames;
    }
}
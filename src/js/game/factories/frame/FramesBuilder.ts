import {Texture} from "pixi.js";
import {FramesPool} from "@/game/factories/frame/FramesPool.ts";

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

        const maxWidth = (this.endFrame ? this.endFrame[0] * this.frameWidth : this.spriteSheet.width) - this.frameWidth;
        const maxHeight = (this.endFrame ? this.endFrame[1] * this.frameHeight : this.spriteSheet.height) - this.frameHeight;

        for (let y = this.startFrame[1] * this.frameHeight; y < this.spriteSheet.height; y += this.frameHeight) {
            for (let x = this.startFrame[0] * this.frameWidth; x < this.spriteSheet.width; x += this.frameWidth) {
                frames.push(FramesPool.get(this.spriteSheet, x, y, this.frameWidth, this.frameHeight));
                if (y > maxHeight && x > maxWidth) return frames;
            }
        }

        return frames;
    }
}
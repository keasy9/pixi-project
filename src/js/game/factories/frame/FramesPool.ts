import {Rectangle, Texture} from "pixi.js";

export const FramesPool = new class {
    protected items =  new Map<string, Texture>();

    protected makeKey(spriteSheet: Texture, x: number, y: number, width: number, height: number) {
        return spriteSheet.source.label + ':' + x  + 'x' + y + '-' + width + 'x' + height;
    }

    public get(spriteSheet: Texture, x: number, y: number, width: number, height: number): Texture {
        const key = this.makeKey(spriteSheet, x, y, width, height);

        if (!this.items.has(key)) {
            this.items.set(key, new Texture({
                source: spriteSheet.source,
                frame: new Rectangle(x, y, width, height),
            }));
        }

        return this.items.get(key)!;
    }
}
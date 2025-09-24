import {Rectangle, Texture} from "pixi.js";

export const FramesPool = new class extends Map<string, Texture[]> {
    protected makeKey(spriteSheet: Texture, x: number, y: number, width: number, height: number) {
        return spriteSheet.source.label + '_' + x  + 'x' + y + '_' + width + 'x' + height;
    }

    public get(spriteSheet: Texture, x: number, y: number, width: number, height: number): Texture {
        const key = this.makeKey(spriteSheet, x, y, width, height);

        if (!this.has(key)) {
            this.set(key, new Texture({
                source: spriteSheet,
                frame: new Rectangle(x, y, width, height),
            }));
        }

        return super.get(key);
    }
}
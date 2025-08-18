import {Rectangle, Sprite, type TextureSource} from 'pixi.js';
import {Texture} from 'pixi.js';

type TSpriteFrameOptions = {
    width: number,
    height: number,
    spacing?: number,
}

export default class FramedSprite extends Sprite {
    protected frames: Texture[] = [];

    constructor(texture: TextureSource, frameOptions: TSpriteFrameOptions, startFrame: number = 0) {
        super(new Texture({source: texture}));

        frameOptions.spacing ??= 0;

        const frameWidth = frameOptions.width + frameOptions.spacing;
        const frameHeight = frameOptions.height + frameOptions.spacing;

        for (let j = 0; j < texture.height; j += frameHeight) {
            for (let i = 0; i < texture.width; i += frameWidth) {
                this.frames.push(new Texture({
                    source: texture,
                    frame: new Rectangle(i, j, frameOptions.width, frameOptions.height)
                }));
            }
        }


        this.texture = this.frames[startFrame];
    }
}
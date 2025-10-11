import {SpriteSheet} from '@/game/const.ts';
import {Assets, Container, Sprite, Texture} from 'pixi.js';
import {FramePool} from '@/game/rendering/FramePool.ts';
import Game from '@/game/Game.ts';

export default class ParallaxBgFactory {
    protected static frameSize: [number, number] = [128, 256];
    protected static layers = 3;

    public static create(): Container[] {
        const source = Assets.get(SpriteSheet.Space);

        const frames: Texture[] = [];

        for (let frame = 0; frame < this.layers; frame++) {
            frames.push(FramePool.get(source, this.frameSize[0] * frame, 0, this.frameSize[0] * frame + 1, this.frameSize[1]));
        }

        return frames.map(frame => {
            const container = new Container<Sprite>();

            const sprite = new Sprite(frame);
            sprite.x = 0;
            sprite.y = 0;

            const clone = new Sprite(frame);
            clone.x = 0;
            clone.y = -this.frameSize[1];

            container.addChild(sprite, clone);
            container.scale = 1.1;

            Game.instance.graphics.addChild(container);

            return container;
        });
    }
}

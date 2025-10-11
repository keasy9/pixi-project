import {AnimatedSprite, Container, type Texture} from 'pixi.js';
import {SpriteSheet} from '@/game/const.ts';
import {Assets} from 'pixi.js';
import {FramePool} from '@/game/rendering/FramePool.ts';

export default class PlayerFactory {
    protected static frameSize: [number, number] = [8, 8];
    protected sprite?: AnimatedSprite;
    protected container?: Container;

    public constructor(protected playerType: 0|1|2|3|4 = 0) {}
    public getSprite(): AnimatedSprite {
        if (this.sprite) return this.sprite;

        const source = Assets.get(SpriteSheet.Ships);
        const frames: Texture[] = [];

        const y = PlayerFactory.frameSize[1] * this.playerType;
        for (let x = 0; x < 3; x++) {
            frames.push(FramePool.get(source, x * PlayerFactory.frameSize[0], y, (x + 1) * PlayerFactory.frameSize[0], y + PlayerFactory.frameSize[1]));
        }

        this.sprite = new AnimatedSprite(frames);
        this.sprite.gotoAndStop(1);

        return this.sprite;
    }

    public getContainer(): Container {
        if (this.container) return this.container;

        this.container = new Container();
        this.container.addChild(this.getSprite());

        return this.container;
    }
}

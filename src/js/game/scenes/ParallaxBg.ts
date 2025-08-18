import AbstractScene from '@/game/scenes/AbstractScene.ts';
import {Assets, Container, Sprite, Texture} from 'pixi.js';
import {GAME_HEIGHT, GAME_WIDTH, SPRITE_BG} from '@/const.ts';
import {Rectangle} from 'pixi.js';
import {Game} from '@/game/managers/GameManager.ts';
import {EBus} from '@/utils/EventBus.ts';

export default class ParallaxBg extends AbstractScene {
    protected speed: number = .5;

    constructor() {
        super('bg');

        const frameWidth = GAME_WIDTH;
        const frameHeight = GAME_HEIGHT;
        const frameSpacing = 1;

        // первая часть - сплошной чёрный фон, пропускаем её
        // todo подумать, либо добавить первую часть, либо убрать её из текстуры
        for (let i = 1; i < 3; i++) {
            const container = new Container<Sprite>();

            const frame = new Rectangle(
                i * (frameWidth + frameSpacing),
                0,
                frameWidth,
                frameHeight,
            );

            const topSprite = new Sprite(new Texture({
                source: Assets.get(SPRITE_BG),
                frame: frame,
            }));

            const bottomSprite = new Sprite(topSprite.texture);
            topSprite.y = -topSprite.height;

            container.addChild(
                topSprite,
                bottomSprite,
            );

            this.addChild(container);
        }

        this.scale.set(Game.scale);

        EBus.on('resize', (_w, _h, scale) => this.scale.set(scale));
    }

    public update(dt: number): void {
        this.children.forEach((layer, index) => {
            layer.y += (index + 1) * this.speed * dt;

            if (layer.y >= GAME_HEIGHT) layer.y -= GAME_HEIGHT;
        });
    }
}

import AbstractScene from '@/game/scenes/AbstractScene.ts';
import {Container, Sprite} from 'pixi.js';
import {SpriteFactory} from "@/game/factories/sprite/SpriteFactory.ts";
import {Game} from '@/game/managers/GameManager.ts';

export default class ParallaxBg extends AbstractScene<Container> {
    protected speed: number = .1;

    constructor() {
        super('bg');

        SpriteFactory.createSpace().forEach(layer => {
            const container = new Container<Sprite>();
            container.addChild(layer, layer.clone().move(0, -layer.height));
            container.scale.set(1.3);
            this.addChild(container);
        });

        Game.event.on('moveEffectHorizontal', this.setHorizontalOffset.bind(this));
        Game.event.on('speedEffectVertical', this.setSpeed.bind(this));
    }

    public setHorizontalOffset(offset: number) {
        offset *= Game.scale * 6;
        this.children.forEach((layer, index) => {
            layer.x = (index + 1) * offset;
        });
    }

    public setSpeed(speed: number, multiplier: number = .05) {
        this.speed = .1  - speed * multiplier;
    }

    public update(dt: number): void {
        this.children.forEach((layer, index) => {
            layer.y += (index + 1 * (index + 1)) * this.speed * dt;

            if (layer.y >= layer.height / 2) layer.y -= layer.height / 2;
        });
    }
}

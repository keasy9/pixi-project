import AbstractScene from '@/game/scenes/AbstractScene.ts';
import {Container, Sprite} from 'pixi.js';
import {SpriteFactory} from "@/game/factories/sprite/SpriteFactory.ts";

export default class ParallaxBg extends AbstractScene {
    protected speed: number = .1;

    constructor() {
        super('bg');

        SpriteFactory.createSpace().forEach(layer => {
            const container = new Container<Sprite>();
            container.addChild(layer, layer.clone().move(0, -layer.height));
            this.addChild(container);
        });
    }

    public update(dt: number): void {
        this.children.forEach((layer, index) => {
            layer.y += (index + 1 * (index + 1)) * this.speed * dt;

            if (layer.y >= this.height) layer.y -= this.height;
        });
    }
}

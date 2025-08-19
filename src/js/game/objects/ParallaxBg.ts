import {SPRITE_BG} from '@/const.ts';

type TParallaxBgLayer = {
    container: Phaser.GameObjects.Container,
    speed: number,
}

export default class ParallaxBg extends Phaser.GameObjects.Container {
    protected layers: TParallaxBgLayer[] = [];

    constructor(scene: Phaser.Scene, protected speed: number = 5) {
        super(scene, 0, 0);

        const bgWidth = scene.cameras.main.width;
        const bgHeight = scene.cameras.main.height;

        const halfWidth = bgWidth / 2;

        // первый слой фона - сплошной чёрный, не добавляем его
        for (let i = 1; i < 3; i++) {
            let container = new Phaser.GameObjects.Container(scene, 0, 0);
            const firstSprite = new Phaser.GameObjects.Sprite(scene, -halfWidth, 0, SPRITE_BG, i)
                .setOrigin(0, 0)
                .setDisplaySize(bgWidth, bgHeight);

            const secondSprite = (Phaser.Utils.Objects.Clone(firstSprite) as Phaser.GameObjects.Sprite)
                .setX(-halfWidth).setY(-bgHeight);

            container.add([
                firstSprite,
                (Phaser.Utils.Objects.Clone(firstSprite) as Phaser.GameObjects.Sprite).setX(halfWidth),
                secondSprite,
                (Phaser.Utils.Objects.Clone(secondSprite) as Phaser.GameObjects.Sprite).setX(halfWidth)
            ]);

            this.add(container);

            this.layers.push({
                container: container,
                speed: (3 - i) * .01,
            });
        }
    }

    public setSpeed(speed: number) {
        // todo inertia?
        this.speed = speed;
    }

    public setHorizontalOffset(offset: number) {
        offset = Math.max(Math.min(offset, 100), -100);
        this.layers.forEach(layer => {
            layer.container.x = layer.speed * this.speed * offset;
        });
    }

    public preUpdate(_: number, dt: number) {
        this.layers.forEach(layer => {
            layer.container.y += layer.speed * this.speed * dt;

            if (layer.container.y >= this.scene.cameras.main.height) {
                layer.container.y -= this.scene.cameras.main.height;
            }
        });
    }
}

import {SPRITE_BG} from '@/const.ts';

type TParallaxBgLayer = {
    container: Phaser.GameObjects.Container,
    speed: number,
}

export default class ParallaxBg extends Phaser.GameObjects.Container {
    protected layers: TParallaxBgLayer[] = [];

    constructor(scene: Phaser.Scene, protected speed: number = 0) {
        super(scene, 0, 0);

        const bgWidth = scene.cameras.main.width * 1.1;
        const bgHeight = scene.cameras.main.height * 1.1;

        // первый слой фона - сплошной чёрный, не добавляем его
        for (let i = 1; i < 3; i++) {
            let container = new Phaser.GameObjects.Container(scene, 0, 0);
            const firstSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, SPRITE_BG, i)
                .setOrigin(0, 0)
                .setDisplaySize(bgWidth, bgHeight);

            const secondSprite = new Phaser.GameObjects.Sprite(scene, 0, -bgHeight, SPRITE_BG, i)
                .setOrigin(0, 0)
                .setDisplaySize(bgWidth, bgHeight);

            container.add(firstSprite);
            container.add(secondSprite);

            this.add(container);

            this.layers.push({
                container: container,
                speed: i * .01,
            });
        }
    }

    public setSpeed(speed: number) {
        // todo inertia
        this.speed = speed;
    }

    public toLeft() {
        // todo
    }

    public toRight() {
        // todo
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

import ObjectPool from '@/game/objects/pools/ObjectPool';
import type {TClass} from '@/utils/Types';
import Enemy from '@/game/objects/enemy/Enemy';

export class EnemyPool extends ObjectPool<Enemy> {
    protected provideFrameInsteadOfTexture = true;

    constructor(
        scene: Phaser.Scene,
        classType: TClass<Enemy> = Enemy,
    ) {
        super(scene, classType);
    }

    public preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        this.children.iterate(child => {
            if (!child.active) return true;

            if (child.dead) this.killAndHide(child);

            if (child.body.checkCollision.none) {
                if (
                    child.x > -child.displayWidth
                    || child.y > -child.displayHeight
                    || child.x < this.scene.cameras.main.width + child.displayWidth
                    || child.y < this.scene.cameras.main.height + child.displayHeight
                ) {
                    // враг появился на экране, с этого момента надо включить коллизии
                    child.body.checkCollision.none = false;
                }

            } else if (
                child.x < -child.displayWidth
                || child.y < -child.displayHeight
                || child.x > this.scene.cameras.main.width + child.displayWidth
                || child.y > this.scene.cameras.main.height + child.displayHeight
            ) {
                this.killAndHide(child);
            }

            return true;
        });
    }
}
import ObjectPool from '@/game/objects/pools/ObjectPool';
import type {TClass} from '@/utils/Types';
import Enemy from '@/game/objects/Enemy';

export class BulletPool extends ObjectPool<Enemy> {

    constructor(
        scene: Phaser.Scene,
        protected objectType: TClass<Enemy> = Enemy,
    ) {
        super(scene, objectType);

        // this.runChildUpdate = true; ?
    }

    public preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        this.children.iterate(child => {
            if (!child.active) return true;

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
                child.setActive(false);
                this.killAndHide(child);
            }

            return true;
        });
    }
}
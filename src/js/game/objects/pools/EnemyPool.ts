import ObjectPool from '@/game/objects/pools/ObjectPool';
import {Bullet} from '@/game/objects/particles/Bullet';
import type {TClass} from '@/utils/Types';

export class BulletPool extends ObjectPool<Bullet> {

    constructor(
        scene: Phaser.Scene,
        protected objectType: TClass<Bullet> = Bullet,
    ) {
        super(scene, objectType);
    }

    public preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        this.children.iterate(child => {
            if (
                child.active
                && (
                    child.x < -child.displayWidth
                    || child.y < -child.displayHeight
                    || child.x > this.scene.cameras.main.width + child.displayWidth
                    || child.y > this.scene.cameras.main.height + child.displayHeight
                )
            ) {
                child.setActive(false);
                this.killAndHide(child);
            }

            return true;
        });
    }
}
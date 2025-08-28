import ObjectPool from '@/game/objects/pools/ObjectPool';
import {Bullet, BULLET_TYPE} from '@/game/objects/particles/Bullet';
import type {TClass} from '@/utils/Types';

export class BulletPool extends ObjectPool<Bullet> {
    protected provideFrameInsteadOfTexture = true;

    constructor(
        scene: Phaser.Scene,
        classType: TClass<Bullet> = Bullet,
    ) {
        super(scene, classType, '', BULLET_TYPE.STICK);
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
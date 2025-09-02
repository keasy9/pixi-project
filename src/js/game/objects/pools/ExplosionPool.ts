import ObjectPool, {type TObjectPoolMakeConfig} from '@/game/objects/pools/ObjectPool';
import type {TClass} from '@/utils/Types';
import {Explosion, EXPLOSION_VARIANT} from '@/game/objects/particles/Explosion';

export class ExplosionPool extends ObjectPool<Explosion> {
    protected provideFrameInsteadOfTexture = true;

    constructor(
        scene: Phaser.Scene,
        classType: TClass<Explosion> = Explosion,
    ) {
        super(scene, classType, '', EXPLOSION_VARIANT.ORANGE);
    }

    public make(config: TObjectPoolMakeConfig = {}): Explosion {
        const instance = super.make(config);

        instance.play();

        return instance;
    }
}
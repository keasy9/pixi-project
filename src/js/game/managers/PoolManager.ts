import ObjectPool from '@/game/objects/pools/ObjectPool';
import {Game} from '@/game/GameState';
import type {Class} from '@/utils/Types';
import {BulletPool} from '@/game/objects/pools/BulletPool';
import {Bullet} from '@/game/objects/particles/Bullet';

const poolMap: Map<Class<Phaser.GameObjects.GameObject>, Class<ObjectPool>> = new Map();
poolMap.set(Bullet, BulletPool);

class PoolManager {
    protected pools: Map<Class, ObjectPool> = new Map;

    public get<T extends Phaser.GameObjects.GameObject = Phaser.GameObjects.GameObject>(objectType: Class<T>): ObjectPool<T> {
        if (!this.pools.has(objectType)) {
            const pool = poolMap.get(objectType) ?? ObjectPool;
            this.pools.set(objectType, new pool(Game.scene, objectType));
        }

        return this.pools.get(objectType)! as ObjectPool<T>;
    }

    public forget(objectType: Class): this {
        this.pools.delete(objectType);

        return this;
    }
}

export const Pool = new PoolManager();

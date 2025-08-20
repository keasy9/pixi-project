import ObjectPool from '@/game/objects/pools/ObjectPool';
import {Game} from '@/game/GameState';
import type {TClass} from '@/utils/Types';
import {BulletPool} from '@/game/objects/pools/BulletPool';
import {Bullet} from '@/game/objects/particles/Bullet';

const poolMap: Map<TClass<Phaser.GameObjects.GameObject>, TClass<ObjectPool>> = new Map();
poolMap.set(Bullet, BulletPool);

class PoolManager {
    protected get pools(): Map<TClass, ObjectPool>
    {
        if (!Game.sceneState.has('object-pools')) {
            Game.sceneState.set('object-pools', new Map());
        }

        return Game.sceneState.get('object-pools');
    }

    public get<T extends Phaser.GameObjects.GameObject = Phaser.GameObjects.GameObject>(objectType: TClass<T>): ObjectPool<T> {
        if (!this.pools.has(objectType)) {
            const pool = poolMap.get(objectType) ?? ObjectPool;
            this.pools.set(objectType, new pool(Game.scene, objectType));
        }

        return this.pools.get(objectType)! as ObjectPool<T>;
    }

    public forget(objectType: TClass): this {
        this.pools.delete(objectType);

        return this;
    }
}

export const Pool = new PoolManager();

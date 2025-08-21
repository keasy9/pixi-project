import ObjectPool from '@/game/objects/pools/ObjectPool';
import {Game} from '@/game/GameState';
import type {TClass} from '@/utils/Types';
import {BulletPool} from '@/game/objects/pools/BulletPool';
import {Bullet} from '@/game/objects/particles/Bullet';

const poolMap: Map<TClass<Phaser.GameObjects.GameObject>, TClass<ObjectPool>> = new Map();
poolMap.set(Bullet, BulletPool);

export enum POOL {
    PLAYER_BULLET,
    ENEMY_BULLET,
}

class PoolManager {
    protected get pools(): Map<POOL, ObjectPool>
    {
        if (!Game.sceneState.has('object-pools')) {
            Game.sceneState.set('object-pools', new Map());
        }

        return Game.sceneState.get('object-pools');
    }

    public get<T extends Phaser.GameObjects.GameObject = Phaser.GameObjects.GameObject>(key: POOL, objectType: TClass<T>): ObjectPool<T> {
        if (!this.pools.has(key)) {
            const pool = poolMap.get(objectType) ?? ObjectPool;
            this.pools.set(key, new pool(Game.scene, objectType));
        }

        return this.pools.get(key)! as ObjectPool<T>;
    }

    public forget(key: POOL): this {
        this.pools.delete(key);

        return this;
    }
}

export const Pool = new PoolManager();

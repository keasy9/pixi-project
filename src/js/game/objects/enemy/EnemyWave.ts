import type Enemy from '@/game/objects/enemy/Enemy';
import {TypedGroup} from '@/game/objects/abstract/TypedGroup';
import {POOL, Pool} from '@/game/managers/PoolManager';
import {Explosion} from '@/game/objects/particles/Explosion';

export type EnemyVelocityFunc = (enemy: Enemy, dt: number, time: number) => void;

export class EnemyWave extends TypedGroup<Enemy> {
    protected _movementFunc?: EnemyVelocityFunc;

    public set movementFunc(func: EnemyVelocityFunc) {
        this._movementFunc = func;
    }

    public preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        if (this._movementFunc) {
            this.getChildren().forEach(enemy => {
                if (enemy.dead) {
                    this.scene.tweens.add({
                        targets: enemy,
                        alpha: {from: 1, to: 0},
                        duration: 150,
                        onComplete: () => this.killAndHide(enemy),
                    });
                    this.remove(enemy);
                    enemy.body.reset(enemy.x, enemy.y);
                    Pool.get(POOL.EXPLOSION, Explosion).make({x: enemy.x, y: enemy.y});
                    return;
                }

                this._movementFunc!(enemy, delta, time)
            });
        }
    }
}
import type Enemy from '@/game/objects/enemy/Enemy';
import {TypedGroup} from '@/game/objects/abstract/TypedGroup';

export type EnemyMovementFunc = (enemy: Enemy, dt: number) => void;

export class EnemyWave extends TypedGroup<Enemy> {
    protected _movementFunc?: EnemyMovementFunc;

    public set movementFunc(func: EnemyMovementFunc) {
        this._movementFunc = func;
    }

    public preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        if (this._movementFunc) {
            this.getChildren().forEach(enemy => {
                if (enemy.dead) {
                    this.killAndHide(enemy);
                    this.remove(enemy);
                    return;
                }

                this._movementFunc!(enemy, delta)
            });
        }
    }
}
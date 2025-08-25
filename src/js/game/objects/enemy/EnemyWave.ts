import type Enemy from '@/game/objects/enemy/Enemy';

export type EnemyMovementFunc = (enemy: Enemy, dt: number) => void;

export class EnemyWave extends Phaser.GameObjects.Group {
    protected _movementFunc?: EnemyMovementFunc;

    public set movementFunc(func: EnemyMovementFunc) {
        this._movementFunc = func;
    }

    public preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        if (this._movementFunc) {
            this.getChildren().forEach((enemy) => this._movementFunc!(enemy as Enemy, delta));
        }
    }
}
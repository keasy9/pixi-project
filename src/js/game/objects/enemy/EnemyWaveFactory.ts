import Enemy, {type ENEMY_TYPE} from '@/game/objects/enemy/Enemy';
import {type TShape, WAVE_SHAPE} from '@/game/objects/enemy/types/TShape';
import {MOVEMENT_PATTERN, type TMovement} from '@/game/objects/enemy/types/TMovement';
import {type EnemyVelocityFunc, EnemyWave} from '@/game/objects/enemy/EnemyWave';
import {POOL, Pool} from '@/game/managers/PoolManager';
import {EnemyPlacer} from '@/game/objects/enemy/EnemyPlacer';
import {COLLIDER, Collider} from '@/game/managers/CollisionManager';

export type TEnemyWaveConfig = {
    enemyType: ENEMY_TYPE, // todo подумать, а что если в одной волне захочется сделать разных врагов?
    enemyCount: number,
    angle: number,
    spawnOffset?: number, // от 1 до -1, волна пропорционально сдвинется на половину ширины игры
    shape: TShape,
    movement: TMovement,
}

export class EnemyWaveFactory {
    /**
     * Создать волну
     *
     * @param scene сцена
     * @param config параметры волны
     */
    public static make(scene: Phaser.Scene, config: TEnemyWaveConfig): void {
        const wave = new EnemyWave(scene);

        wave.addMultiple(this.makeEnemies(config));

        this.placeEnemies(wave, config);

        wave.movementFunc = this.getVelocityFunc(config);

        scene.add.existing(wave as Phaser.GameObjects.Group);
    }

    /**
     * Создать врагов
     *
     * @param config параметры волны
     * @protected
     */
    protected static makeEnemies(config: TEnemyWaveConfig): Enemy[] {
        const enemies: Enemy[] = [];
        for (let i = 0; i < config.enemyCount; i++) {
            const enemy = Pool.get(POOL.ENEMY, Enemy).make({x: 0, y: 0, frame: config.enemyType});
            //Collider.add(enemy, COLLIDER.ENEMY);
            enemies.push(enemy);
        }

        return enemies;
    }

    /**
     * Расставить врагов
     *
     * @param wave волна
     * @param config параметры волны
     * @protected
     */
    protected static placeEnemies(wave: EnemyWave, config: TEnemyWaveConfig): void {
        switch (config.shape.type) {
            case WAVE_SHAPE.GRID:
                EnemyPlacer.grid(wave, config);
                break;
        }

        EnemyPlacer.applyRotation(wave, config);
    }

    /**
     * Получить функцию движения врага в зависимости от параметров волны
     *
     * @param config параметры волны
     * @protected
     */
    protected static getVelocityFunc(config: TEnemyWaveConfig): EnemyVelocityFunc {
        const angleRad = Phaser.Math.DegToRad(config.angle - 180);

        switch (config.movement.pattern) {
            case MOVEMENT_PATTERN.LINEAR:
                const deltaX = Math.cos(angleRad) * config.movement.speed;
                const deltaY = Math.sin(angleRad) * config.movement.speed;

                return (enemy: Enemy) => {
                    enemy.body.setVelocity(deltaX, deltaY);
                };
        }
    }
}
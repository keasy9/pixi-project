import Enemy, {type ENEMY_TYPE} from '@/game/objects/enemy/Enemy';
import {type TShape, WAVE_SHAPE} from '@/game/objects/factories/types/TShape';
import type {TMovement} from '@/game/objects/factories/types/TMovement';
import {EnemyWave} from '@/game/objects/enemy/EnemyWave';
import {POOL, Pool} from '@/game/managers/PoolManager';
import {Game} from '@/game/GameState';

export type TEnemyWaveConfig = {
    enemyType: ENEMY_TYPE, // todo подумать, а что если в одной волне захочется сделать разных врагов?
    enemyCount: number,
    angle: number,
    spawnOffset?: number, // от 0 до 1
    shape: TShape,
    movement: TMovement,
}

export class EnemyWaveFactory {
    public static make(scene: Phaser.Scene, config: TEnemyWaveConfig): void {
        const wave = new EnemyWave(scene);

        wave.addMultiple(this.makeEnemies(scene, config));

        this.placeEnemies(wave, config);
    }

    protected static makeEnemies(scene: Phaser.Scene, config: TEnemyWaveConfig): Enemy[] {
        const enemies: Enemy[] = [];
        for (let i = 0; i < config.enemyCount; i++) {
            enemies.push(
                Pool.get(POOL.ENEMY, Enemy)
                    .make({scene: scene, x: 0, y: 0, variant: config.enemyType})
                    .setVisible(false)
                    .setActive(false)
            );
        }

        return enemies;
    }

    protected static placeEnemies(wave: EnemyWave, config: TEnemyWaveConfig): void {
        /**
         * todo спавнить для нулевого угла, затем поворачивать вокруг центра на угол
         */
        const spawnX = 0;
        const spawnY = 0;

        const twiceSize = Enemy.SIZE_IN_GRID * 2;

        switch (config.shape.type) {
            case WAVE_SHAPE.GRID:

                const cellWidth = (Enemy.SIZE_IN_GRID + twiceSize * (config.shape.colGap ?? 0)) * Game.scale;
                const cellHeight = (Enemy.SIZE_IN_GRID + twiceSize * (config.shape.rowGap ?? 0)) * Game.scale;
                const maxWidth = Math.floor(wave.scene.cameras.main.width / cellWidth);
                const width = config.shape.maxRows ? Math.min(config.shape.maxRows, maxWidth) : maxWidth;

                const groupWidth = cellWidth * width;
                const groupHeight = cellHeight * Math.ceil(wave.getChildren().length / width);

                Phaser.Actions.GridAlign(wave.getChildren(), {
                    x: spawnX - groupWidth / 2,  // будет по центру
                    y: spawnY - groupHeight / 2, // будет по центру
                    width,
                    cellWidth,
                    cellHeight,
                    position: Phaser.Display.Align.CENTER,
                });

                break;
        }
    }
}
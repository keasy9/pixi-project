import Enemy, {type ENEMY_TYPE} from '@/game/objects/enemy/Enemy';
import {type TShape, WAVE_SHAPE} from '@/game/objects/enemy/types/TShape';
import {MOVEMENT_PATTERN, type TMovement} from '@/game/objects/enemy/types/TMovement';
import {type EnemyMovementFunc, EnemyWave} from '@/game/objects/enemy/EnemyWave';
import {POOL, Pool} from '@/game/managers/PoolManager';
import {Game} from '@/game/GameState';

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

        wave.addMultiple(this.makeEnemies(scene, config));

        this.placeEnemies(wave, config);

        wave.movementFunc = this.getMovementFunc(config);

        scene.add.existing(wave);
    }

    /**
     * Создать врагов
     *
     * @param scene сцена
     * @param config параметры волны
     * @protected
     */
    protected static makeEnemies(scene: Phaser.Scene, config: TEnemyWaveConfig): Enemy[] {
        const enemies: Enemy[] = [];
        for (let i = 0; i < config.enemyCount; i++) {
            enemies.push(Pool.get(POOL.ENEMY, Enemy).make({scene: scene, x: 0, y: 0, variant: config.enemyType}));
        }

        return enemies;
    }

    /**
     * Получить точку спавна волны с учётом угла движения и перпендикулярного смещения. Точка будет находиться на краю
     * видимой области игры
     *
     * @param camera основная камера игры
     * @param angle угол движения волны в радианах
     * @param offset перпендикулярное смещение волны
     * @protected
     */
    protected static getSpawnPoint(camera: Phaser.Cameras.Scene2D.Camera, angle: number, offset: number): Phaser.Geom.Point {
        const centerX = camera.width / 2;
        const centerY = camera.height / 2;

        let result = new Phaser.Geom.Point(centerX, 0);

        // 1) находим точку с учётом angle
        const toPoint = new Phaser.Geom.Point(
            centerX + Math.cos(angle) * camera.height,
            centerY + Math.sin(angle) * camera.height
        );

        if (offset !== 0) {
            // 2) находим первендикулярный угол
            let perpendicularAngle = angle + (Math.PI / 2);

            // 3) сдвигаем её на offset по перпендикулярному углу
            toPoint.x += Math.cos(perpendicularAngle) * offset;
            toPoint.y += Math.sin(perpendicularAngle) * offset;
        }

        // 4) создаём луч из центра к точке
        const ray = new Phaser.Geom.Line(
            centerX,
            centerY,
            toPoint.x,
            toPoint.y,
        );

        // 5) создаем прямоугольник экрана
        const screenRect = new Phaser.Geom.Rectangle(0, 0, camera.width, camera.height);

        // 6) находим точку пересечения луча с прямоугольником
        const intersectPoints = Phaser.Geom.Intersects.GetLineToRectangle(ray, screenRect);
        if (intersectPoints.length > 0) result = intersectPoints[0] as Phaser.Geom.Point;

        return result;
    }

    /**
     * Расставить врагов
     *
     * @param wave волна
     * @param config параметры волны
     * @protected
     */
    protected static placeEnemies(wave: EnemyWave, config: TEnemyWaveConfig): void {
        const angleRad = Phaser.Math.DegToRad(config.angle);

        const spawnPoint = this.getSpawnPoint(
            wave.scene.cameras.main,
            angleRad,
            wave.scene.cameras.main.width / 2 * (config.spawnOffset ?? 0),
        );

        const twiceSize = Enemy.SIZE_IN_GRID * 2;

        switch (config.shape.type) {
            case WAVE_SHAPE.GRID:
                // todo вместо GridAlign надо расставлять врагов самому, потому что gridAlign не учитывает поворот

                const cellWidth = (Enemy.SIZE_IN_GRID + twiceSize * (config.shape.colGap ?? 0)) * Game.scale;
                const cellHeight = (Enemy.SIZE_IN_GRID + twiceSize * (config.shape.rowGap ?? 0)) * Game.scale;
                const maxWidth = Math.floor(wave.scene.cameras.main.width / cellWidth);
                const width = config.shape.maxRows ? Math.min(config.shape.maxRows, maxWidth) : maxWidth;

                const groupWidth = cellWidth * width;
                const groupHeight = cellHeight * Math.ceil(wave.getChildren().length / width);

                const spawnOffset = Phaser.Math.Rotate(
                    new Phaser.Geom.Point(groupHeight / 2, groupWidth / 2),
                    angleRad,
                );

                Phaser.Actions.GridAlign(wave.getChildren(), {
                    x: spawnPoint.x + spawnOffset.x - groupWidth / 2,
                    y: spawnPoint.y + spawnOffset.y - groupHeight / 2,
                    width,
                    cellWidth,
                    cellHeight,
                    position: Phaser.Display.Align.CENTER,
                });

                break;
        }

        wave.getChildren().forEach(enemy => {
            (enemy as Enemy).setRotation(angleRad + Math.PI/2);
        })
    }

    /**
     * Получить функцию движения врага в зависимости от параметров волны
     *
     * @param config параметры волны
     * @protected
     */
    protected static getMovementFunc(config: TEnemyWaveConfig): EnemyMovementFunc {
        const angleRad = Phaser.Math.DegToRad(config.angle - 180);

        switch (config.movement.pattern) {
            case MOVEMENT_PATTERN.LINEAR:
                const deltaX = Math.cos(angleRad) * config.movement.speed * .01;
                const deltaY = Math.sin(angleRad) * config.movement.speed * .01;

                return (enemy: Enemy, dt: number) => {
                    enemy.x += deltaX * dt;
                    enemy.y += deltaY * dt;
                };
        }
    }
}
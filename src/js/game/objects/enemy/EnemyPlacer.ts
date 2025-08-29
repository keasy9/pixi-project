import type {EnemyWave} from '@/game/objects/enemy/EnemyWave';
import type {TEnemyWaveConfig} from '@/game/objects/enemy/EnemyWaveFactory';
import Enemy from '@/game/objects/enemy/Enemy';
import {Game} from '@/game/GameState';
import {collect} from '@/utils/Collection.ts';

export class EnemyPlacer {
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
            centerY + Math.sin(angle) * camera.height,
        );

        if (offset !== 0) {
            // 2) находим перпендикулярный угол
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
        if (intersectPoints.length > 0) {
            result = intersectPoints[0] as Phaser.Geom.Point;

            // fix js :)
            result.x = Math.floor(result.x);
            result.y = Math.floor(result.y);
        }

        return result;
    }

    /**
     * Расположить врагов по сетке. Учитывает угол, в отличии от Phaser.Actions.GridAlign
     * @param wave
     * @param config
     */
    public static grid(wave: EnemyWave, config: TEnemyWaveConfig): void {
        const angleRad = Phaser.Math.DegToRad(config.angle);

        // это должен быть центр первого ряда сетки
        const spawnCenter = this.getSpawnPoint(
            wave.scene.cameras.main,
            angleRad,
            wave.scene.cameras.main.width / 2 * (config.spawnOffset ?? 0),
        );

        const colGap = Enemy.SIZE_IN_GRID * (config.shape.colGap ?? 0);
        const rowGap = Enemy.SIZE_IN_GRID * (config.shape.rowGap ?? 0);

        const cellWidth = (Enemy.SIZE_IN_GRID + colGap) * Game.scale;
        const cellHeight = (Enemy.SIZE_IN_GRID + rowGap) * Game.scale;

        const maxWidth = Math.floor(wave.scene.cameras.main.width / cellWidth);

        const colsCount = Math.min(
            config.shape.maxCols ? Math.min(config.shape.maxCols, maxWidth) : maxWidth,
            wave.getChildren().length,
        );

        const groupWidth = colsCount * cellWidth;

        // угол 0 это справа, поэтому ширина пойдёт вниз, т.е. откладываем по перпендикулярному углу
        const perpAngle = angleRad + Math.PI / 2;

        const spawnOffset = groupWidth / 2 - cellWidth / 2;
        const spawnPoint = {
            x: spawnCenter.x + Math.cos(perpAngle) * spawnOffset,
            y: spawnCenter.y + Math.sin(perpAngle) * spawnOffset,
        };

        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);

        const chunks = collect(wave.getChildren() as Enemy[]).chunk(colsCount);

        const lastRowWidth = chunks.last!.length * cellWidth;

        const lastRowSpawnOffset = lastRowWidth / 2 - cellWidth / 2
        const lastRowSpawnPoint = {
            x: spawnCenter.x + Math.cos(perpAngle) * lastRowSpawnOffset,
            y: spawnCenter.y + Math.sin(perpAngle) * lastRowSpawnOffset,
        };

        chunks.each((chunk, row) => chunk.each((enemy, col) => {
            const rowOffset = row * cellHeight;
            let colOffset;

            // для последней строки считаем отдельно, потому что там врагов может быть меньше
            if (row === chunks.length - 1) {
                colOffset = lastRowWidth * (((chunks.last!.length - col) / chunks.last!.length) - 1);

                enemy.x = lastRowSpawnPoint.x + cos * rowOffset - sin * colOffset;
                enemy.y = lastRowSpawnPoint.y + sin * rowOffset + cos * colOffset;
            } else {
                colOffset = groupWidth * (((colsCount - col) / colsCount) - 1);

                enemy.x = spawnPoint.x + cos * rowOffset - sin * colOffset;
                enemy.y = spawnPoint.y + sin * rowOffset + cos * colOffset;
            }

            enemy.x = Math.round(enemy.x);
            enemy.y = Math.round(enemy.y);
        }));
    }

    public static applyRotation(wave: EnemyWave, config: TEnemyWaveConfig) {
        const angleRad = Phaser.Math.DegToRad(config.angle);

        wave.getChildren().forEach(enemy => {
            (enemy as Enemy).setRotation(angleRad + Math.PI / 2);
        });
    }
}
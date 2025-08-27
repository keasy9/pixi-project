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
        if (intersectPoints.length > 0) result = intersectPoints[0] as Phaser.Geom.Point;

        return result;
    }

    public static grid(wave: EnemyWave, config: TEnemyWaveConfig): void {
        const angleRad = Phaser.Math.DegToRad(config.angle);

        // это должен быть центр первого ряда сетки
        const spawnPoint = this.getSpawnPoint(
            wave.scene.cameras.main,
            angleRad,
            wave.scene.cameras.main.width / 2 * (config.spawnOffset ?? 0),
        );

        const colGap = Enemy.SIZE_IN_GRID * (config.shape.colGap ?? 0);
        const rowGap = Enemy.SIZE_IN_GRID * (config.shape.rowGap ?? 0);

        const cellWidth = (Enemy.SIZE_IN_GRID + colGap) * Game.scale;
        const cellHeight = (Enemy.SIZE_IN_GRID + rowGap) * Game.scale;

        const halfCellWidth = cellWidth / 2;
        const halfCellHeight = cellHeight / 2;

        const maxWidth = Math.floor(wave.scene.cameras.main.width / cellWidth);

        const colsCount = Math.min(
            config.shape.maxCols ? Math.min(config.shape.maxCols, maxWidth) : maxWidth,
            wave.getChildren().length,
        );

        const groupWidth = colsCount * cellWidth;

        // угол 0 это справа, поэтому ширина пойдёт вниз, т.е. откладываем по перпендикулярному углу
        const perpAngle = angleRad + Math.PI / 2;

        spawnPoint.y += Math.sin(perpAngle) * (groupWidth / 2);
        spawnPoint.x += Math.cos(perpAngle) * (groupWidth / 2);

        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);

        collect(wave.getChildren() as Enemy[])
            .chunk(colsCount)
            .each((chunk, row) => chunk.each((enemy, col) => {
                const rowOffset = row * cellHeight;
                const colOffset = groupWidth * (((colsCount - col) / colsCount) - 1);

                enemy.x = spawnPoint.x + cos * rowOffset - sin * colOffset;
                enemy.y = spawnPoint.y + sin * rowOffset + cos * colOffset;

                // todo сделать чтобы последняя строка выравнивалась по центру, если в ней меньше элементов чем в остальных
            }));
    }

    public static applyRotation(wave: EnemyWave, config: TEnemyWaveConfig) {
        const angleRad = Phaser.Math.DegToRad(config.angle);

        wave.getChildren().forEach(enemy => {
            (enemy as Enemy).setRotation(angleRad + Math.PI / 2);
        });
    }
}
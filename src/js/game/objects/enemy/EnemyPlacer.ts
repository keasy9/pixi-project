import type {EnemyWave} from '@/game/objects/enemy/EnemyWave';
import type {TEnemyWaveConfig} from '@/game/objects/enemy/EnemyWaveFactory';
import Enemy from '@/game/objects/enemy/Enemy';
import {Game} from '@/game/GameState';

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

    // todo вместо GridAlign надо расставлять врагов самому, потому что gridAlign не учитывает поворот
    public static grid(wave: EnemyWave, config: TEnemyWaveConfig): void {
        const angleRad = Phaser.Math.DegToRad(config.angle);

        const spawnPoint = this.getSpawnPoint(
            wave.scene.cameras.main,
            angleRad,
            wave.scene.cameras.main.width / 2 * (config.spawnOffset ?? 0),
        );

        const twiceSize = Enemy.SIZE_IN_GRID * 2;

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
    }

    public static applyRotation(wave: EnemyWave, config: TEnemyWaveConfig) {
        const angleRad = Phaser.Math.DegToRad(config.angle);

        wave.getChildren().forEach(enemy => {
            (enemy as Enemy).setRotation(angleRad + Math.PI/2);
        })
    }
}
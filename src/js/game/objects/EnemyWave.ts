import type {LevelWave} from '@/game/managers/level/types/wave.ts';
import type {Updateable} from '@/game/types/Updateable.ts';
import type Enemy from '@/game/objects/Enemy.ts';

export default class EnemyWave implements Updateable {
    protected enemies: Enemy[] = [];
    protected enemyMovement: (enemy: Enemy) => void = () => {};

    public constructor(waveConf: LevelWave) {
        // todo создавать врагов из конфига
    }

    public update(dt: number) {
        this.enemies.forEach((enemy, index) => {
            if (enemy.dead) {
                // избегаем реиндексации как дорогой операции, forEach пропускает пробелы в массиве автоматически
                delete this.enemies[index];
                return;
            }

            this.enemyMovement(enemy);
        })
    }
}
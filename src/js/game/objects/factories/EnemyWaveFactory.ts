import type {ENEMY_TYPE} from '@/game/objects/enemy/Enemy';
import type {TShape} from '@/game/objects/factories/types/TShape';
import type {TMovement} from '@/game/objects/factories/types/TMovement';

export type TEnemyWaveConfig = {
    enemyType: ENEMY_TYPE,
    enemyCount: number,
    spawnPoint: [number, number],
    shape: TShape,
    movement: TMovement,
}

export class EnemyWaveFactory {

}
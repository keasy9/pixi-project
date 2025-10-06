import type AbstractScene from '@/game/scenes/AbstractScene.ts';
import type {LevelWave} from '@/game/managers/level/types/wave.ts';
import EnemyWave from '@/game/objects/EnemyWave.ts';
import ObjectPool from '@/game/pool/ObjectPool.ts';
import Enemy from '@/game/objects/Enemy.ts';

export default class WaveManager {
    protected pool: ObjectPool<Enemy>;
    public constructor(protected scene: AbstractScene) {
        this.pool = new ObjectPool(Enemy);
    }

    public create(waveConf: LevelWave): EnemyWave {
        return new EnemyWave(waveConf);
    }
}
import type AbstractScene from '@/game/scenes/AbstractScene.ts';
import type {LevelWave} from '@/game/managers/level/types/wave.ts';
import EnemyWave from '@/game/objects/EnemyWave.ts';

export default class WaveManager {
    public constructor(protected scene: AbstractScene) { }

    public create(waveConf: LevelWave): EnemyWave {
        const wave = new EnemyWave();

        return wave;
    }
}
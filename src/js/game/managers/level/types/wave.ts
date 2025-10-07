import type {LevelEvent} from '@/game/managers/level/types/level.ts';
import type {LevelEventType} from '@/game/managers/level/types/level.ts';


enum WaveSpawnType {
    Sequence,// новый враг спавнится когда предыдущий уничтожен
    Grid, // сетка
    V, // клин
}

enum EnemyMovementPattern {
    Linear, // прямо
    Sinus, // по синусоиде
    ToPlayer, // преследовать игрока
}

enum EnemyFirePattern {
    Random, // рандом
    Periodically, // периодически
}

interface EnemyFireParams {
    pattern: EnemyFirePattern;
    speed?: number; // со значением по-умолчанию
    bullet: number; // тип пули todo enum или keyof typeof

    // todo другие параметры в зависимости от pattern
}

interface EnemyMovementParams {
    pattern: EnemyMovementPattern;
    speed?: number; // со значением по-умолчанию

    // todo другие параметры в зависимости от pattern
}

export const enemyType = Record<number, [number, number]> = {
    // frame: [width, height]
    1: [5, 5],
    2: [7, 5],
    3: [5, 5],
    4: [6, 4],
    5: [5, 4],
    6: [7, 5],
    7: [6, 4],
    8: [6, 4],
    9: [5, 5],
    10: [6, 5],
    11: [6, 5],
    12: [4, 5],
    13: [7, 6],
    14: [8, 6],
    15: [6, 6],
    16: [6, 5],
    17: [8, 5],
    18: [6, 5],
    19: [6, 6],
    20: [6, 6],
    21: [6, 6],
    22: [5, 6],
    23: [6, 5],
    24: [8, 6],
    25: [8, 8],
    26: [8, 8],
    27: [8, 8],
    28: [8, 7],
    29: [6, 6],
    30: [8, 6],
    31: [8, 6],
    32: [6, 8],
    33: [6, 6],
    34: [6, 6],
    35: [6, 6],
    36: [8, 7],
}

interface EnemyDef {
    type: keyof typeof enemyType;
    fire?: EnemyFireParams;
    movementPattern?: EnemyMovementPattern;
    movementSpeed?: number; // скорость врага. Надо умножать на коэффициент, чтобы скорость была примерно ожидаемой независимо от movementPattern. Со значением по-умолчанию
}

export interface LevelWave extends LevelEvent {
    type: LevelEventType.Wave;
    angle: number; // угол в градусах. Волна заспавнится за пределами экрана в точке, соответствующей этому углу к центру экрана
    offset: number; // смещение волны перпендикулярно углу (angle) от -1 до 1. -1 это смещение на ширину экрана влево, 1 - вправо
    spawnType: WaveSpawnType;
    movement: EnemyMovementParams;
    fire: EnemyFireParams;
    enemies: ((keyof typeof enemyType)|EnemyDef)[]; // враги. Если число, то это тип врага, если объект, то это индивидуальные параметры врага
}

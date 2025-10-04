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

interface EnemyDef {
    type: number; // todo enum или keyof typeof
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
    enemies: (number|EnemyDef)[]; // враги. Если число, то это тип врага, если объект, то это индивидуальные параметры врага
}

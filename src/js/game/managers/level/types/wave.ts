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

export enum EnemyType {
    White = 0,
    Fork = 1,
    Trident = 2,
    Ocean = 4,
    Grass = 5,
    Crab = 6,
    Dark = 7,
    Girl = 8,
    Peak = 9,
    Sun = 10,
    Spoon = 11,
    Tiny = 12,
    Tree = 13,
    Woman = 14,
    Star = 15,
    Rocket = 16,
    Brown = 17,
    Ball = 18,
    Wedge = 19,
    Foot = 20,
    Handsome = 21,
    Fish = 22,
    Knuckle = 23,
    Drop = 24,
    Devil = 25,
    Goat = 26,
    Beetle = 27,
    Grig = 28,
    Puddle = 29,
    Hugger = 30,
    Sea = 31,
    Head = 32,
    Hasher = 33,
    Grip = 34,
    Butt = 35,
    Glider = 36,
}

export interface EnemyDef {
    type: EnemyType;
    fire?: EnemyFireParams;
    movement?: EnemyMovementParams;
}

export interface LevelWave extends LevelEvent {
    type: LevelEventType.Wave;
    angle: number; // угол в градусах. Волна заспавнится за пределами экрана в точке, соответствующей этому углу к центру экрана
    offset: number; // смещение волны перпендикулярно углу (angle) от -1 до 1. -1 это смещение на ширину экрана влево, 1 - вправо
    spawnType: WaveSpawnType;
    movement: EnemyMovementParams;
    fire: EnemyFireParams;
    enemies: (EnemyType|EnemyDef)[]; // враги. Если число, то это тип врага, если объект, то это индивидуальные параметры врага
}

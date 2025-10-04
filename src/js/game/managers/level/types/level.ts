import type {LevelWave} from '@/game/managers/level/types/wave.ts';
import type {LevelDialog} from '@/game/managers/level/types/dialog.ts';
import type {LevelBoss} from '@/game/managers/level/types/boss.ts';

export interface LevelData {
    number: number;
    timeline: AnyLevelEvent[];
    // todo другие свойства, например сложность и рекорды
}

export enum LevelEventType {
    Wave,
    Dialog,
    Boss,
}

export interface LevelEvent {
    delay?: number; // время старта с момента старта предыдущего события. Если предыдущее событие - диалог, то будет проигнорировано
    type: LevelEventType,
}

export type AnyLevelEvent = LevelWave | LevelBoss | LevelDialog;

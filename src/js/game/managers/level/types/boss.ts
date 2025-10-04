import type {LevelEvent} from '@/game/managers/level/types/level.ts';
import type {LevelEventType} from '@/game/managers/level/types/level.ts';

export interface LevelBoss extends LevelEvent {
    type: LevelEventType.Boss;
    bossName: string; // тип босса todo enum или keyof typeof
}
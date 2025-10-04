import type {LevelEvent} from '@/game/managers/level/types/level.ts';
import type {LevelEventType} from '@/game/managers/level/types/level.ts';

interface DialogAnswer {
    id: string|number; // ID для отправки на сервер выбранного ответа
    text: string; // текст ответа
    next?: DialogNode['id']; // ID следующего монолога, если выбран этот ответ
}

interface DialogNode {
    id: string|number; // ID для выбора след. узла на основе выбранного ответа
    person?: string; // todo enum или keyof typeof
    text: string; // текст монолога
    answers?: DialogAnswer[];
    next?: DialogNode['id']; // ID следующего монолога, если нет ответов или у них не указан след. монолог
}

export interface LevelDialog extends LevelEvent {
    type: LevelEventType.Dialog;
    person: string; // todo enum или keyof typeof
    nodes: DialogNode[];
    startNode: DialogNode['id'];
}
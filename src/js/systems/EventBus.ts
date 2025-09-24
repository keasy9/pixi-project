import type AbstractScene from '@/game/scenes/AbstractScene.ts';

export interface EventMap {
    resize: [number, number, number]; // width, height, scale
    sceneLoad: [AbstractScene];
    sceneUnload: [AbstractScene];
}

export default class EventBus {
    protected listeners: {
        [K in keyof EventMap]?: Array<(...payload: EventMap[K]) => void>;
    } = {};

    public on<K extends keyof EventMap>(
        event: K,
        callback: (...payload: EventMap[K]) => void
    ): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]!.push(callback);
    }

    public off<K extends keyof EventMap>(
        event: K,
        callback: (...payload: EventMap[K]) => void
    ): void {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event]!.filter((cb) => cb !== callback);
    }

    public emit<K extends keyof EventMap>(event: K, ...payload: EventMap[K]): void {
        if (!this.listeners[event]) return;
        this.listeners[event]!.forEach((callback) => callback(...payload));
    }
}

import type AbstractScene from '@/game/scenes/AbstractScene.ts';

interface EventMap {
    resize: [number, number, number]; // width, height, scale

    sceneLoaded: [AbstractScene];
    sceneUnloaded: [AbstractScene];

    moveEffectHorizontal: [number]; // offset, от 1 до -1
    speedEffectVertical: [number]; // speed, от 1 до -1
}

export default class EventBus {
    protected listeners: { [K in keyof EventMap]?: Array<(...payload: EventMap[K]) => void>; } = {};

    public on<K extends keyof EventMap>(event: K, callback: (...payload: EventMap[K]) => void): this {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event]!.push(callback);

        return this;
    }

    public off<K extends keyof EventMap>(event: K, callback: (...payload: EventMap[K]) => void): this {
        if (!this.listeners[event]) return this;

        const index = this.listeners[event].indexOf(callback);
        if (index > -1) this.listeners[event].splice(index, 1);

        return this;
    }

    public emit<K extends keyof EventMap>(event: K, ...payload: EventMap[K]): this {
        if (!this.listeners[event]) return this;
        this.listeners[event]!.forEach((callback) => callback(...payload));
        4
        return this;
    }
}

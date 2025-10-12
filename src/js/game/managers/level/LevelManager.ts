import type {LevelData} from '@/game/managers/level/types/level.ts';
import type AbstractScene from '@/game/scenes/AbstractScene.ts';
import {Assets, Ticker} from 'pixi.js';
import type {Updatable} from '@/game/objects/interfaces/Updatable.ts';
import {LevelEventType} from '@/game/managers/level/types/level.ts';
import WaveManager from '@/game/managers/level/WaveManager.ts';

export default class LevelManager implements Updatable {
    protected loaded: Record<string, LevelData> = {};
    protected currentLevel?: LevelData;
    protected currentEvent: number = 0;
    protected eventTime: number = 0;
    protected isRunning: boolean = false;

    protected _wave?: WaveManager;

    constructor(protected scene: AbstractScene) {}

    protected get wave(): WaveManager {
        this._wave ??= new WaveManager(this.scene);
        return this._wave;
    }

    public async load(levelName: string): Promise<this> {
        return new Promise(async (resolve) => {
            // 1) уровень уже загружен
            if (this.loaded[levelName]) {
                this.currentLevel = this.loaded[levelName];
                resolve(this);
                return;
            }

            // 2) файл уровня уже был загружен ранее, но используется впервые
            const jsonDataKey = `level_${levelName}`;
            this.loaded[levelName] = this.currentLevel = Assets.get(jsonDataKey);
            if (this.currentLevel) {
                resolve(this);
                return;
            }

            // 3) уровень ещё не был загружен
            const data = await Assets.load({
                alias: jsonDataKey,
                src: `data/levels/${levelName}.json`,
            });
            this.loaded[levelName] = this.currentLevel = data;
            resolve(this);
        });
    }

    public start(): this {
        if (!this.currentLevel) throw 'Уровень не загружен!';
        this.isRunning = true;

        return this;
    }

    public stop(): this {
        this.isRunning = false;
        this.currentEvent = 0;
        this.eventTime = 0;
        return this;
    }

    public update(ticker: Ticker): void {
        this.eventTime += ticker.deltaTime;

        if (this.canRunNextEvent()) {
            this.currentEvent++;
            this.eventTime = 0;

            this.runCurrentEvent();
        }
    }

    protected isLastEventRunning(): boolean {
        return this.currentEvent === this.currentLevel?.timeline.length;
    }

    protected canRunNextEvent(): boolean {
        if (this.isLastEventRunning()) return false;

        const nextEventDelay = this.currentLevel?.timeline[this.currentEvent + 1].delay ?? 0;
        return nextEventDelay >= this.eventTime;
    }

    protected runCurrentEvent(): void {
        const event = this.currentLevel?.timeline[this.currentEvent];
        if (!event) throw `Не удалось получить событие [${this.currentEvent}] из таймлайна уровня [${this.currentLevel?.number}]!`;

        switch (event.type) {
            case LevelEventType.Wave:
                this.wave.create(event); // todo подумать, может отказаться от менеджера волн?
                break;

            case LevelEventType.Dialog:
            case LevelEventType.Boss:
            default:
                return;
        }
    }
}

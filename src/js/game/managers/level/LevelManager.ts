import type {LevelData} from '@/game/managers/level/types/level.ts';
import type AbstractScene from '@/game/scenes/AbstractScene.ts';
import {Assets} from 'pixi.js';

export default class LevelManager {
    protected loaded: Record<string, LevelData> = {};
    protected currentLevel?: LevelData;
    protected currentEvent: number = 0;
    protected eventTime: number = 0;
    protected isRunning: boolean = false;

    constructor(protected scene: AbstractScene) {}

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

        // todo return LevelTimeline class

        return this;
    }
}

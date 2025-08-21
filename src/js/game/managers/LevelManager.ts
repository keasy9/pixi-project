import {EnemyWaveFactory, type TEnemyWaveConfig} from '@/game/objects/factories/EnemyWaveFactory';

type TLevel = {
    timeline: TLevelEvent[],
};

enum EVENT_TYPE {
    WAVE = 'wave',
}

interface BaseLevelEvent {
    type: EVENT_TYPE;
    delay: number,
}

interface LevelWave extends BaseLevelEvent {
    type: EVENT_TYPE.WAVE;
    data: TEnemyWaveConfig,
}

type TLevelEvent = LevelWave;

// запускат события не чаще чем раз в полсекунды
const minEventDelay = 50;

export default class LevelManager {
    protected loaded: Record<number, TLevel> = [];
    protected current?: TLevel;
    protected timeline?: Phaser.Time.Timeline;

    constructor(protected scene: Phaser.Scene) {}

    public load(level: number): Promise<this> {
        return new Promise((resolve) => {
            // 1) уровень уже загружен
            if (this.loaded[level]) {
                this.current = this.loaded[level];
                resolve(this);
                return;
            }

            // 2) файл уровня уже был загружен ранее, но используется впервые
            const jsonDataKey = `level_${level}`;
            this.loaded[level] = this.current = this.scene.cache.json.get(jsonDataKey);
            if (this.current) {
                resolve(this);
                return;
            }

            // 3) уровень ещё не был загружен
            this.scene.load.json(jsonDataKey, `data/levels/${level}.json`);
            this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
                this.loaded[level] = this.current = this.scene.cache.json.get(jsonDataKey);
                resolve(this);
            });
            this.scene.load.start();
        });
    }

    public start(): this {
        if (!this.current) throw 'нечего запускать, загрузи уровень сначала';

        this.timeline?.destroy();

        this.timeline = this.scene.add.timeline({});
        this.current.timeline.forEach(event => {
            this.timeline!.add({
                from: Math.max(event.delay, minEventDelay),
                run: () => this.runEvent(event),
            });
        });

        this.timeline.play();

        return this;
    }

    public stop(): this {
        this.timeline?.pause();

        return this;
    }

    public resume(): this {
        this.timeline?.resume();

        return this;
    }

    public destroy(): this {
        this.timeline?.destroy();

        return this;
    }

    protected runEvent(event: TLevelEvent): void {
        switch (event.type) {
            case EVENT_TYPE.WAVE:
                EnemyWaveFactory.make(this.scene, event.data);
                break;
        }
    }
}

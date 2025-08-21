import type {TEnemyWaveConfig} from '@/game/objects/factories/EnemyWaveFactory';

type TLevel = {
    timeline: TLevelEvent[],
};

enum TIMELINE_ITEM_TYPE {
    WAVE = 'wave',
}

interface BaseLevelEvent {
    type: TIMELINE_ITEM_TYPE;
    delay: number,
}

interface LevelWave extends BaseLevelEvent {
    type: TIMELINE_ITEM_TYPE.WAVE;
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

    public load(level: number): this|Promise<this> {
        // 1) уровень уже загружен
        if (this.loaded[level]) {
            this.current = this.loaded[level];
            return this;
        }

        // 2) файл уровня уже был загружен ранее, но используется впервые
        const jsonDataKey = `level_${level}`;
        this.loaded[level] = this.current = this.scene.cache.json.get(jsonDataKey);
        if (this.current) return this;

        // 3) уровень ещё не был загружен
        return new Promise((resolve) => {
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
        // todo
    }
}

import {ANIM_EXHAUST, SPRITE_EXHAUST} from '@/const';

// значение - стартовый фрейм без учёта цвета
export enum EXHAUST_SIZE {
    SINGLE = 0,
    DOUBLE = 8,
    QUADRUPLE = 16,
}

// значение - поправка на индекс фрейма для учёта цвета
export enum EXHAUST_COLOR {
    ORANGE = 0,
    GREEN = 4,
}

const FRAMES_COUNT = 3;

export class Exhaust extends Phaser.GameObjects.Sprite {
    public readonly animKey: string;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        protected size: EXHAUST_SIZE = EXHAUST_SIZE.SINGLE,
        protected color: EXHAUST_COLOR = EXHAUST_COLOR.ORANGE,
        play: boolean = true,
    ) {
        const frame = size + color;

        super(scene, x, y, SPRITE_EXHAUST, frame);

        this.animKey = `${ANIM_EXHAUST}_${size}_${color}`;

        if (!scene.anims.exists(this.animKey)) {
            scene.anims.create({
                key: this.animKey,
                repeat: -1,
                duration: 200,
                frames: scene.anims.generateFrameNumbers(
                    SPRITE_EXHAUST,
                    {start: frame, end: frame + FRAMES_COUNT},
                ),
            });
        }

        if (play) this.play();
    }

    public play(key?: string | Phaser.Animations.Animation | Phaser.Types.Animations.PlayAnimationConfig, ignoreIfPlaying?: boolean): this {
        return super.play(key ?? this.animKey, ignoreIfPlaying);
    }
}
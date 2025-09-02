import VariableSprite from '@/game/objects/abstract/VariableSprite';
import {ANIM_EXPLOSION, SPRITE_EXPLOSIONS} from '@/const';

export enum EXPLOSION_VARIANT {
    PURPLE = 0,
    ORANGE = 4,
    BLUE = 8,
}

const FRAMES_COUNT = 4-1;

export class Explosion extends VariableSprite<EXPLOSION_VARIANT> {
    protected animKey: string;
    constructor(scene: Phaser.Scene, x: number, y: number, variant: EXPLOSION_VARIANT = EXPLOSION_VARIANT.ORANGE) {
        super(scene, x, y, variant, false);

        this.animKey = `${ANIM_EXPLOSION}_${variant}`;

        if (!scene.anims.exists(this.animKey)) {
            scene.anims.create({
                key: this.animKey,
                duration: 400,
                frames: scene.anims.generateFrameNumbers(
                    SPRITE_EXPLOSIONS,
                    {start: variant, end: Number(variant) + FRAMES_COUNT},
                ),
            });
        }

        this.on(`animationcomplete-${this.animKey}`, () => this.setActive(false).setVisible(false));
    }

    protected getTextureKey(): string {
        return SPRITE_EXPLOSIONS;
    }

    public play(key?: string | Phaser.Animations.Animation | Phaser.Types.Animations.PlayAnimationConfig, ignoreIfPlaying?: boolean): this {
        return super.play(key ?? this.animKey, ignoreIfPlaying);
    }
}
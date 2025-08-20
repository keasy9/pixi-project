import type {TSize} from '@/utils/Types.ts';
import {Game} from '@/game/GameState.ts';

/**
 * Спрайт, который может иметь несколько вариантов внешнего вида, но всегда одно поведение.
 * Предусматривает создание физ. тела и различия вариантов по размеру
 */
export default abstract class VariableSprite<TVariant extends number> extends Phaser.GameObjects.Sprite {
    protected defaultWidth?: number = undefined;
    protected defaultHeight?: number = undefined;

    declare body: Phaser.Physics.Arcade.Body|null;

    constructor(scene: Phaser.Scene, x: number, y: number, variant: TVariant, withBody: boolean = true, scale: boolean = true) {
        super(scene, x, y, '');

        this.setTexture(this.getTextureKey(), variant);

        if (scale) this.setScale(Game.scale);

        if (withBody) {
            scene.physics.add.existing(this);
            this.correctBody(variant);
        }
    }

    protected abstract getTextureKey(): string;

    /**
     * Вариант внешнего вида спрайта
     * @param variant
     */
    public set variant(variant: TVariant) {
        this.setFrame(variant, true, true);
        if (this.body) this.correctBody(variant);
    }

    /**
     * Скорректировать размер физ. тела под указанный вариант
     * @param variant
     * @protected
     */
    protected correctBody(variant: TVariant): void {
        const defaultFrame = this.texture.getFrameBounds(0);
        this.defaultWidth ??= defaultFrame.width;
        this.defaultHeight ??= defaultFrame.height;

        const sizesMap = this.getSizesMap();

        (this.body as Phaser.Physics.Arcade.Body).setSize(
            sizesMap[variant]?.width ?? this.defaultWidth,
            sizesMap[variant]?.height ?? this.defaultHeight,
        ).setOffset(0, 0);
    }

    /**
     * Метод должен возвращать карту размеров. Для размеров, не указанных в карте будет использоваться стандартный
     * размер фрейма в текстуре спрайта
     * @protected
     */
    protected getSizesMap(): {[K in TVariant]?: Partial<TSize>} {
        return {};
    }
}
<template>
    <canvas
        ref="canvas"
        :width="width"
        :height="height"
    />
</template>

<script setup lang="ts">
    import {computed, onBeforeUnmount, ref, useTemplateRef, watch} from 'vue';
    import Load from '@/game/scenes/Load.ts';
    import Main from '@/game/scenes/Main.ts';
    import {Game} from '@/game/GameState';

    type TSize = {
        width: number,
        height: number,
    }

    const props = defineProps<TSize>();

    const gameConfig = computed<Phaser.Types.Core.GameConfig & TSize>(() => {
        return {
            type: Phaser.WEBGL,
            pixelArt: true,
            width: props.width,
            height: props.height,
            canvas: canvas.value,
            physics: {

                default: 'arcade',
                arcade: {debug: import.meta.env.DEV},
            },
            scene: [Load, Main],
        } as Phaser.Types.Core.GameConfig & TSize;
    });

    const game = ref<Phaser.Game|null>(null);

    const canvas = useTemplateRef<HTMLCanvasElement|null>('canvas');

    watch(gameConfig, () => {
        if (!game.value && gameConfig.value.width !== 0 && gameConfig.value.height !== 0) {
            game.value = new Phaser.Game(gameConfig.value);
            Game.init(game.value as Phaser.Game);
        }

        // чтобы движение было плавным несмотря на пиксельную графику, каждый объект придётся ресайзить по-отдельности
        Game.resize(props.width, props.height);
    });

    onBeforeUnmount(() => Game.destroy());
</script>

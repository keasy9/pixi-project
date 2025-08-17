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

    type TSize = {
        width: number,
        height: number,
    }

    const props = defineProps<TSize>();

    const dimentionWidth = 128;

    const gameConfig = computed<Phaser.Types.Core.GameConfig & TSize>(() => {
        return {
            type: Phaser.WEBGL,
            pixelArt: true,
            width: props.width,
            height: props.height,
            canvas: canvas.value,
            physics: {
                default: 'arcade',
                arcade: {debug: true},
            },
            scene: [Load, Main],
        } as Phaser.Types.Core.GameConfig;
    });

    const game = ref<Phaser.Game|null>(null);

    const canvas = useTemplateRef<HTMLCanvasElement|null>('canvas');

    watch(gameConfig, () => {
        game.value?.scale.resize(gameConfig.value.width, gameConfig.value.height);

        if (!game.value && gameConfig.value.width !== 0 && gameConfig.value.height !== 0) {
            game.value = new Phaser.Game(gameConfig.value);
        }

        // чтобы движение было плавным несмотря на пиксельную графику, каждый объект придётся ресайзить по-отдельности
        game.value?.registry.set('gameScale', (gameConfig.value.width / dimentionWidth).toFixed(2));
        game.value?.events.emit('resize', game.value?.registry.get('gameScale'));
    });

    onBeforeUnmount(() => game.value?.destroy(false));

    defineExpose({game: game});
</script>

<style scoped lang="less">

</style>
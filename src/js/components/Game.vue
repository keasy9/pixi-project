<template>
    <canvas
        ref="canvas"
        :width="width"
        :height="height"
        class="canvas"
    />
</template>

<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
    import * as PIXI from 'pixi.js';
    import {EBus} from '@/utils/EventBus.ts';
    import {Game} from '@/game/managers/GameManager.ts';
    import {GAME_WIDTH} from '@/const.ts';

    const props = defineProps<{
        width: number,
        height: number,
    }>();

    const canvas = ref<HTMLCanvasElement | null>(null);
    const gameScale = ref(1);

    async function initGame() {
        if (!canvas.value) return;

        const app = new PIXI.Application();

        await app.init({
            canvas: canvas.value,
            width: props.width,
            height: props.height,
            backgroundColor: 0x000000,
            antialias: false,
            resolution: Math.floor(window.devicePixelRatio) || 1,
            autoDensity: true,
            roundPixels: false,
        });

        Game.init(app);

        gameScale.value = parseFloat((props.width / GAME_WIDTH).toFixed(2));
    }

    function handleResize() {
        gameScale.value = parseFloat((props.width / GAME_WIDTH).toFixed(2));

        EBus.emit('resize', props.width, props.height, gameScale.value);
    }

    watch(() => [props.width, props.height], () => {
        if (Game.isReady()) handleResize();
        else initGame();
    });

    onMounted(() => initGame());

    onBeforeUnmount(() => {
        if (Game.isReady()) Game.destroy();
    });
</script>

<style scoped lang="less">
    .canvas {
        image-rendering: pixelated;
    }
</style>
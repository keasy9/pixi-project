<template>
    <canvas
        ref="canvas"
        :width="width"
        :height="height"
    />
</template>

<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
    import Game from "@/game/Game.ts";


    const props = defineProps<{
        width: number,
        height: number,
    }>();

    const canvas = ref<HTMLCanvasElement | null>(null);
    const config = {size: [128, 256]};

    watch(() => [props.width, props.height], () => Game.resize(props.width, props.height));
    onMounted(() => Game.init(canvas.value, config));
    onBeforeUnmount(Game.destroy);
</script>
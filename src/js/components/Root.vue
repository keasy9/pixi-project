<template>
    <div class="root">
        <Game
            :width="width"
            :height="height"
            class="root__layer root__layer--game"
        />
        <div class="root__layer root__layer--gui"/>
    </div>
</template>

<script setup lang="ts">
    import {onBeforeUnmount, onMounted, ref} from 'vue';
    import debounce from 'debounce';
    import Game from '@/components/Game.vue';

    const width = ref<number>(0);
    const height = ref<number>(0);

    const onResize = debounce(() => {
        let gameHeight = window.innerHeight;
        let gameWidth = Math.floor(gameHeight / 2);

        if (gameWidth > window.innerWidth) {
            gameWidth = window.innerWidth;
            gameHeight = gameWidth * 2;
        }

        width.value = gameWidth;
        height.value = gameHeight;
    }, 500);

    onMounted(() => {
        window.addEventListener('resize', onResize, {passive: true});

        onResize();
    });

    onBeforeUnmount(() => window.removeEventListener('resize', onResize));
</script>

<style lang="less">
    .root {
        position: relative;
        height: 100vh;
        aspect-ratio: 1/2;

        &__layer {
            width: 100%;
            height: 100%;

            &--gui {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                pointer-events: none;

                & > * {
                    pointer-events: auto;
                }
            }
        }
    }
</style>
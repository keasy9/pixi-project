import {SCENE_LOAD, SCENE_MAIN, SPRITE_BG, SPRITE_EXHAUST, SPRITE_SHIPS} from '@/const.ts';

export default class Load extends Phaser.Scene {
    constructor ()
    {
        super(SCENE_LOAD);
    }

    create ()
    {
        // todo progressbar, intro

        this.load.spritesheet(
            SPRITE_BG,
            '/assets/sprites/space_layers.png',
            {frameWidth: 128, frameHeight: 256, spacing: 1},
        );

        this.load.spritesheet(
            SPRITE_SHIPS,
            '/assets/sprites/ships.png',
            {frameWidth: 8, frameHeight: 8},
        );

        this.load.spritesheet(
            SPRITE_EXHAUST,
            '/assets/sprites/exhaust.png',
            {frameWidth: 4, frameHeight: 5},
        );

        this.load.once('complete', () => {
            this.scene.start(SCENE_MAIN);
            this.scene.stop(SCENE_LOAD);
        });

        this.load.start();
    }
}
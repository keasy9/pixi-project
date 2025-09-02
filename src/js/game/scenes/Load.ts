import {SPRITE_BG, SPRITE_BULLETS, SPRITE_ENEMIES, SPRITE_EXHAUST, SPRITE_EXPLOSIONS, SPRITE_SHIPS} from '@/const.ts';
import {Game, SCENE} from '@/game/GameState';

export default class Load extends Phaser.Scene {
    constructor ()
    {
        super(SCENE.LOAD);
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

        this.load.spritesheet(
            SPRITE_BULLETS,
            '/assets/sprites/bullets.png',
            {frameWidth: 3, frameHeight: 6},
        );

        this.load.spritesheet(
            SPRITE_ENEMIES,
            '/assets/sprites/enemies.png',
            {frameWidth: 8, frameHeight: 8},
        );

        this.load.spritesheet(
            SPRITE_EXPLOSIONS,
            '/assets/sprites/explosions.png',
            {frameWidth: 8, frameHeight: 8},
        );

        this.load.json('level_1', 'data/levels/1.json');

        this.load.once('complete', () => Game.playScene(SCENE.MAIN).stopScene(SCENE.LOAD));

        this.load.start();
    }
}
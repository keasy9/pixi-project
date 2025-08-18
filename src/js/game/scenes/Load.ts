import {SPRITE_BG, SPRITE_SHIPS} from '@/const.ts';
import AbstractScene from '@/game/scenes/AbstractScene.ts';
import {Assets} from 'pixi.js';
import {Scene} from '@/game/managers/SceneManager.ts';
import ParallaxBg from '@/game/scenes/ParallaxBg.ts';
import Main from '@/game/scenes/Main';

export default class Load extends AbstractScene {
    constructor ()
    {
        super('load');

        // todo progressbar, intro

        Promise.all([

            Assets.load({
                alias: SPRITE_BG,
                src: '/assets/sprites/space_layers.png',
            }).then(() => Scene.load(ParallaxBg, false)),

            Assets.load({
                alias: SPRITE_SHIPS,
                src: '/assets/sprites/ships.png',
            }),

        ]).then(() => Scene.load(Main));
    }
}
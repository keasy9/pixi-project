import AbstractScene from '@/game/scenes/AbstractScene.ts';
import {Assets} from 'pixi.js';
import {Scene} from '@/game/managers/SceneManager.ts';
import ParallaxBg, {SPRITE_BG} from '@/game/scenes/ParallaxBg.ts';
import Main from '@/game/scenes/Main';
import {SpriteSheet} from "@/game/factories/sprite/SpriteFactory.ts";

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
                alias: SpriteSheet.Ships,
                src: '/assets/sprites/ships.png',
            }),

            Assets.load({
                alias: SpriteSheet.Exhausts,
                src: '/assets/sprites/exhaust.png',
            }),

        ]).then(() => Scene.load(Main));
    }
}
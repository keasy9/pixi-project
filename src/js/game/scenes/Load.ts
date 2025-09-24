import AbstractScene from '@/game/scenes/AbstractScene.ts';
import {Assets} from 'pixi.js';
import {Scene} from '@/game/managers/SceneManager.ts';
import ParallaxBg from '@/game/scenes/ParallaxBg.ts';
import Main from '@/game/scenes/Main';
import {SpriteSheet} from "@/game/factories/sprite/SpriteFactory.ts";

export default class Load extends AbstractScene {
    constructor ()
    {
        super('load');

        // todo progressbar, intro

        Promise.all([

            Assets.load({
                alias: SpriteSheet.Space,
                src: '/assets/sprites/space.png',
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
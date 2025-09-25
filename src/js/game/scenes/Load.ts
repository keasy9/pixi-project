import AbstractScene from '@/game/scenes/AbstractScene.ts';
import {Assets} from 'pixi.js';
import ParallaxBg from '@/game/scenes/ParallaxBg.ts';
import Main from '@/game/scenes/Main';
import {SpriteSheet} from "@/game/factories/sprite/SpriteFactory.ts";
import {Game} from '@/game/managers/GameManager.ts';

export default class Load extends AbstractScene {
    constructor () {
        super('load');

        // todo progressbar, intro

        Promise.all([

            Assets.load({
                alias: SpriteSheet.Space,
                src: '/assets/sprites/space.png',
            }).then(() => Game.scene.load(ParallaxBg, false)),

            Assets.load({
                alias: SpriteSheet.Ships,
                src: '/assets/sprites/ships.png',
            }),

            Assets.load({
                alias: SpriteSheet.Exhausts,
                src: '/assets/sprites/exhaust.png',
            }),

        ]).then(() => Game.scene.load(Main));
    }
}
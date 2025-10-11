import {System, system} from '@lastolivegames/becsy';
import {Assets} from 'pixi.js';
import {SpriteSheet} from '@/game/const.ts';

@system // syntax error
export default class Load extends System {
    async prepare(): Promise<void> {
        await Assets.load({
            src: '/public/assets/sprites/space.png',
            alias: SpriteSheet.Space
        });
    }
}
import {System, system} from '@lastolivegames/becsy';
import GameState from '@/game/components/singletons/GameState.ts';
import InputMovable from '@/game/components/InputMovable.ts';
import {Assets} from 'pixi.js';
import {SpriteSheet} from '@/game/const.ts';
import SpriteWithMoveAnimation from '@/game/components/SpriteWithMoveAnimation.ts';
import PlayerFactory from '@/game/rendering/factories/PlayerFactory.ts';
import Graphics from '@/game/components/Graphics.ts';

@system
export default class StateManaging extends System {
    protected state = this.singleton.write(GameState);

    async prepare(): Promise<void> {
        await Assets.load({
            alias: SpriteSheet.Ships,
            src: '/assets/sprites/ships.png',
        });
    }

    public execute() {
        if (!this.state.isPlayerSpawned) {
            const factory = new PlayerFactory();

            this.createEntity(
                InputMovable, {maxSpeed: 10},
                SpriteWithMoveAnimation, {value: factory.getSprite()},
                Graphics, {value: factory.getContainer()},
            );

            this.state.isPlayerSpawned = true;
        }
    }
}

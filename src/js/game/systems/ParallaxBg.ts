import {System, system} from '@lastolivegames/becsy';
import ParallaxBgLayer from '@/game/components/labels/ParallaxBgLayer.ts';
import Position from '@/game/components/Position.ts';
import Speed from '@/game/components/Speed.ts';
import ParallaxBgFactory from '@/game/rendering/ParallaxBgFactory.ts';
import Graphics from '@/game/components/Graphics.ts';
import Game from '@/game/Game.ts';
import {Assets} from 'pixi.js';
import {SpriteSheet} from '@/game/const.ts';
import Movement from '@/game/systems/Movement.ts';
import StateSync from '@/game/systems/StateSync.ts';

@system(s => s.after(Movement).before(StateSync))
export default class ParallaxBg extends System {
    protected layers = this.query(q => q.current.with(ParallaxBgLayer, Position, Speed, Graphics).write)

    async prepare(): Promise<void> {
        await Assets.load({
            src: '/assets/sprites/space.png',
            alias: SpriteSheet.Space
        });
    }

    public initialize() {

        ParallaxBgFactory.create().forEach((container, index) => {
            this.createEntity(
                ParallaxBgLayer,
                Graphics, {value: container},
                Position, {x: 0, y: 0},
                Speed, {x: 0, y: (index + 1) / 3},
            );
        });
    }

    public execute() {
        const screenHeight = Game.instance.renderingSize[1];
        for (const layer of this.layers.current) {
            const pos = layer.write(Position);
            while(pos.y > screenHeight) {
                pos.y -= screenHeight;
            }
        }
    }
}

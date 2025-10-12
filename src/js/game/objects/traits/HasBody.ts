import type {Body} from 'planck';
import {Game} from '@/game/managers/GameManager.ts';
import type {Positionable} from '@/game/objects/interfaces/Positionable.ts';
import type {Rotateble} from '@/game/objects/interfaces/Rotateble.ts';
import type {Class} from '@/types.ts';


export default function HasBody<TBase extends Class<Positionable & Rotateble>>(Base: TBase) {
    return class HasBody extends Base {
        protected body!: Body;

        constructor(...args: any[]) {
            super(...args);
        }

        protected syncPosition(): this {
            const bodyPos = this.body.getPosition();
            const shape = this.body.getFixtureList()?.getShape();
            if (!shape) throw new Error('У этого объекта нет физической формы!');

            if (shape.getType() === 'circle') {
                this.x = Game.physics.worldToScreen(bodyPos.x - shape.getRadius());
                this.y = Game.physics.worldToScreen(bodyPos.y - shape.getRadius());
            }

            return this;
        }

        protected syncRotation(): this {
            this.rotation = this.body.getAngle();
            return this;
        }
    };
}
import {trait} from '@traits-ts/core';
import type {Body} from 'planck';
import {Game} from '@/game/managers/GameManager.ts';
import type {GameObject} from '@/game/types.ts';
import type {Class} from '@/types.ts';

export const HasBody = trait((base: Class<GameObject>) => class HasBody extends base {
    // @ts-ignore
    protected body: Body;

    protected syncPosition(): this {
        const bodyPos = this.body.getPosition();
        const shape = this.body.getFixtureList()?.getShape();
        if (!shape) throw 'У этого объекта нет физической формы!';

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
});
import type {Positionable} from '@/game/types/Positionable.ts';
import type {Rotateble} from '@/game/types/Rotateble.ts';
import type {Updateable} from '@/game/types/Updateable.ts';
import {HasBody} from '@/game/objects/traits/HasBody.ts';
import {derive} from '@traits-ts/core';
import Game from '@/components/Game.vue';

export default class Enemy extends derive(HasBody) implements Positionable, Rotateble, Updateable {
    public get x(): number {
        return Game.physics.worldToScreen(this.body.getPosition().x);
    }

    public get y(): number {
        return Game.physics.worldToScreen(this.body.getPosition().y);
    }

    public set x(x: number) {
        const y = this.body.getPosition().y;
        this.body.setPosition({
            x: Game.physics.screenToWorld(x),
            y: y,
        });
    }

    public set y(y: number) {
        const x = this.body.getPosition().x;
        this.body.setPosition({
            x: x,
            y: Game.physics.screenToWorld(y),
        });
    }

    public get rotation(): number {
        return this.body.getAngle();
    }

    public set rotation(angle: number) {
        this.body.setAngle(angle);
    }

    public update(_dt: number) {
        this.syncPosition();
        this.syncRotation();
    }
}
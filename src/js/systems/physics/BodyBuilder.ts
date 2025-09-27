import {type BodyType, Vec2} from "planck";
import {Game} from "@/game/managers/GameManager.ts";
import type {BodyUserData} from "@/systems/physics/types.ts";
import ExtendedBody from '@/systems/physics/ExtendedBody.ts';
import type ExtendedWorld from '@/systems/physics/ExtendedWorld.ts';

export default class BodyBuilder {
    protected type: BodyType = 'dynamic';
    protected position: Vec2 = new Vec2(0, 0);
    protected userData?: BodyUserData;

    public static(): this {
        this.type = 'static';
        return this;
    }

    public kinematic(): this {
        this.type = 'kinematic';
        return this;
    }

    public dynamic(): this {
        this.type = 'dynamic';
        return this;
    }

    public at(x: number, y: number): this {
        this.position.x = x;
        this.position.y = y;
        return this;
    }

    public with(data?: BodyUserData): this {
        this.userData = data;
        return this;
    }

    public toWorld(scale: boolean = true, world: ExtendedWorld = Game.physics): ExtendedBody {
        const body = new ExtendedBody(world, {
            type: this.type,
            position: scale ? Game.physics.screenPosToWorld(this.position) : this.position,
            userData: this.userData,
        })

        Game.physics.addBody(body);

        return body
    }
}

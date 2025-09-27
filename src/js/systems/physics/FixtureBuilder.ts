import {Box, Circle} from 'planck';
import {Game} from "@/game/managers/GameManager.ts";
import {ExtendedSprite} from '@/game/factories/sprite/ExtendedSprite.ts';
import type ExtendedBody from '@/systems/physics/ExtendedBody.ts';

export default class FixtureBuilder {
    protected _density = 1;
    protected _friction = .5;

    public constructor(protected body: ExtendedBody) { }

    public density(density: number): this {
        this._density = density;
        return this;
    }

    public friction(friction: number): this {
        this._friction = friction;
        return this;
    }

    public box(width: number, height: number, scale: boolean = true): ExtendedBody {
        if (scale) {
            width = Game.physics.screenToWorld(width);
            height = Game.physics.screenToWorld(height);
        }

        this.body.createFixture({
            density: this._density,
            friction: this._friction,
            shape: new Box(width/2, height/2),
        });

        return this.body;
    }

    public circle(sprite: ExtendedSprite, scale?: boolean): ExtendedBody;
    public circle(radius: number, scale?: boolean): ExtendedBody;
    public circle(radius: number|ExtendedSprite, scale: boolean = true): ExtendedBody {
        if (radius instanceof ExtendedSprite) {
            this.body.setSprite(radius);
            radius = radius.width / 2;
        }

        this.body.createFixture({
            density: this._density,
            friction: this._friction,
            shape: new Circle(scale ? Game.physics.screenToWorld(radius) : radius),
        });

        return this.body;
    }
}

import {Body, Box, Circle, type Shape} from 'planck';
import {Game} from "@/game/managers/GameManager.ts";

export default class FixtureBuilder {
    protected _density = 1;
    protected _friction = .5;
    protected _shape?: Shape;

    public constructor(protected body: Body) { }

    public density(density: number): this {
        this._density = density;
        return this;
    }

    public friction(friction: number): this {
        this._friction = friction;
        return this;
    }

    public box(width: number, height: number, scale: boolean = true): Body {
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

    public circle(radius: number, scale: boolean = true): Body {
        this.body.createFixture({
            density: this._density,
            friction: this._friction,
            shape: new Circle(scale ? Game.physics.screenToWorld(radius) : radius),
        });

        return this.body;
    }
}

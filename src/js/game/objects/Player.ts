import {Container} from 'pixi.js';
import {SpriteFactory} from "@/game/factories/sprite/SpriteFactory.ts";
import type {Sprite} from "@/game/factories/sprite/Sprite.ts";
import {Game} from '@/game/managers/GameManager.ts';
import type {KeyboardBinding} from '@/systems/input/types.ts';
import type {GameObject} from '@/game/types.ts';
import {Vec2} from 'planck';
import {derive} from '@traits-ts/core';
import {HasBody} from '@/game/objects/traits/HasBody.ts';

export default class Player extends derive(HasBody, Container) implements GameObject {
    protected shipSprite: Sprite;
    protected exhaustSprites: Sprite[];

    protected speed: number = 7;

    constructor(x: number, y :number) {
        super();

        this.shipSprite = SpriteFactory.createPlayerShip(5);

        this.x = x - this.shipSprite.width/2;
        this.y = y - this.shipSprite.height/2;

        this.addChild(this.shipSprite);

        const exhaust = SpriteFactory.createExhaust();

        this.exhaustSprites = [
            exhaust.moveRelative(2, 8),
            exhaust.clone().skip(1).moveRelative(5, 8),
        ];

        this.addChild(this.exhaustSprites[0]);
        this.addChild(this.exhaustSprites[1]);

        Game.input.keyboard().key('ArrowLeft').bind('left');
        Game.input.keyboard().key('ArrowRight').bind('right');
        Game.input.keyboard().key('ArrowUp').bind('up');
        Game.input.keyboard().key('ArrowDown').bind('down');

        this.body = Game.physics.body()
            .at(x, y)
            .with({sprite: this.shipSprite, object: this})
            .fixture()
            .circle(this.shipSprite.width/2);
    }

    public update(_dt: number) {
        const velocity = new Vec2();

        if (Game.input.getOrFail<KeyboardBinding>('left').isDown()) velocity.x--;
        if (Game.input.getOrFail<KeyboardBinding>('right').isDown()) velocity.x++;
        if (Game.input.getOrFail<KeyboardBinding>('up').isDown()) velocity.y--;
        if (Game.input.getOrFail<KeyboardBinding>('down').isDown()) velocity.y++;

        velocity.normalize();

        this.body.setLinearVelocity(velocity.mul(this.speed));
        if (velocity.x > 0) {
            this.shipSprite.goto(2);
            this.exhaustSprites[1].moveRelative(4, 8);
        } else if (velocity.x < 0) {
            this.shipSprite.goto(0);
            this.exhaustSprites[0].moveRelative(3, 8);
        } else {
            this.shipSprite.goto(1);
            this.exhaustSprites[0].moveRelative(2, 8);
            this.exhaustSprites[1].moveRelative(5, 8);
        }

        this.syncPosition();
    }
}
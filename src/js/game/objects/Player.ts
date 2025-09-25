import {Container} from 'pixi.js';
import {SpriteFactory} from "@/game/factories/sprite/SpriteFactory.ts";
import type {SpriteDecorator} from "@/game/factories/sprite/SpriteDecorator.ts";
import {Game} from '@/game/managers/GameManager.ts';
import type {KeyboardBinding} from '@/systems/Input/types.ts';
import type {GameObjectWithPhysics} from "@/game/types.ts";
import type {BodyWithUserData} from "@/systems/physics/types.ts";
import {Vec2} from "planck";

export default class Player extends Container implements GameObjectWithPhysics {
    protected shipSprite: SpriteDecorator;
    protected exhaustSprites: SpriteDecorator[];
    protected body: BodyWithUserData;

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
            .circle(this.shipSprite.width/2)
            .get();
    }

    public update(_dt: number) {
        const velocity = new Vec2();

        if (Game.input.getOrFail<KeyboardBinding>('left').isDown()) velocity.x--;
        if (Game.input.getOrFail<KeyboardBinding>('right').isDown()) velocity.x++;
        if (Game.input.getOrFail<KeyboardBinding>('up').isDown()) velocity.y--;
        if (Game.input.getOrFail<KeyboardBinding>('down').isDown()) velocity.y++;

        velocity.normalize();

        this.body.setLinearVelocity(velocity.mul(10));
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

        // todo вытащить для легкого переиспользования
        let bodyPos = this.body.getPosition();
        this.x = Game.physics.worldToScreen(bodyPos.x - this.body.getFixtureList()?.getShape().getRadius());
        this.y = Game.physics.worldToScreen(bodyPos.y - this.body.getFixtureList()?.getShape().getRadius());
    }
}
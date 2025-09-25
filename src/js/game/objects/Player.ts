import {Container} from 'pixi.js';
import {SpriteFactory} from "@/game/factories/sprite/SpriteFactory.ts";
import type {SpriteDecorator} from "@/game/factories/sprite/SpriteDecorator.ts";
import {Game} from '@/game/managers/GameManager.ts';
import type {KeyboardBinding} from '@/systems/Input/types.ts';
import type {GameObjectWithPhysics} from "@/game/types.ts";
import type {BodyWithUserData} from "@/systems/physics/types.ts";

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
            exhaust.moveRelative(5, 8),
            exhaust.clone().skipHalf().moveRelative(2, 8),
        ];

        this.addChild(this.exhaustSprites[0]);
        this.addChild(this.exhaustSprites[1]);

        Game.input.keyboard().key('ArrowLeft').bind('left');

        this.body = Game.physics.body()
            .at(x, y)
            .with({sprite: this.shipSprite, object: this})
            .fixture()
            .circle(this.shipSprite.width/2)
            .get();
    }

    public update(_dt: number) {
        if (Game.input.getOrFail<KeyboardBinding>('left').isDown()) {
            console.log('left');
        }
    }
}
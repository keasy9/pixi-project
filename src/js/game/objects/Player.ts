import {Container} from 'pixi.js';
import type {GameObject} from '@/types.ts';
import {SpriteFactory} from "@/game/factories/sprite/SpriteFactory.ts";
import type {SpriteDecorator} from "@/game/factories/sprite/SpriteDecorator.ts";
import {Game} from '@/game/managers/GameManager.ts';
import type {KeyboardBinding} from '@/systems/Input/types.ts';

export default class Player extends Container implements GameObject {
    protected shipSprite: SpriteDecorator;
    protected exhaustSprites: SpriteDecorator[];

    constructor(x: number, y :number) {
        super();

        this.shipSprite = SpriteFactory.createPlayerShip(5);

        this.x = x - this.shipSprite.width/2;
        this.y = y - this.shipSprite.height/2;

        this.addChild(this.shipSprite);

        this.exhaustSprites = [
            SpriteFactory.createExhaust().moveRelative(5, 8),
            SpriteFactory.createExhaust().moveRelative(2, 8),
        ];

        this.addChild(this.exhaustSprites[0]);
        this.addChild(this.exhaustSprites[1]);

        Game.input.keyboard().key('ArrowLeft').bind('left');
    }

    public update(_dt: number) {
        if (Game.input.getOrFail<KeyboardBinding>('left').isDown()) {
            console.log('left');
        }
    }
}
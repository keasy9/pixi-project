import {Container, Sprite} from 'pixi.js';
import type {GameObject} from '@/utils/Types';
import {Game} from '@/game/managers/GameManager';
import {EBus} from '@/utils/EventBus';
import {SpriteFactory} from "@/game/factories/sprite/SpriteFactory.ts";

export default class Player extends Container implements GameObject {
    protected shipSprite: Sprite;

    constructor(x: number, y :number) {
        super();

        this.shipSprite = SpriteFactory.createPlayerShip(5);

        this.x = x - this.shipSprite.width/2;
        this.y = y - this.shipSprite.height/2;

        this.addChild(this.shipSprite);

        this.scale.set(Game.scale);

        EBus.on('resize', (_w, _h, scale) => this.scale.set(scale));
    }

    public update(_dt: number) {

    }
}
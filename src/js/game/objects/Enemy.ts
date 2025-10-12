import type {Positionable} from '@/game/objects/interfaces/Positionable.ts';
import type {Rotateble} from '@/game/objects/interfaces/Rotateble.ts';
import type {Updatable} from '@/game/objects/interfaces/Updatable.ts';
import HasBody from '@/game/objects/traits/HasBody.ts';
import type {Recyclable} from '@/game/objects/interfaces/Recyclable.ts';
import {ExtendedSprite} from "@/game/factories/sprite/ExtendedSprite.ts";
import CanBeRecycled from '@/game/objects/traits/CanBeRecycled.ts';
import type {Ticker} from 'pixi.js';


export default class Enemy extends CanBeRecycled(HasBody(ExtendedSprite)) implements Positionable, Rotateble, Updatable, Recyclable {
    public update(_ticker: Ticker) {
        this.syncPosition();
        this.syncRotation();
    }
}
import type {Positionable} from '@/game/types/Positionable.ts';
import type {Rotateble} from '@/game/types/Rotateble.ts';
import type {Updateable} from '@/game/types/Updateable.ts';
import {HasBody} from '@/game/objects/traits/HasBody.ts';
import {derive} from '@traits-ts/core';
import type {Recyclable} from '@/game/types/Recyclable.ts';
import {CanBeRecycled} from '@/game/objects/traits/CanBeRecycled.ts';
import {ExtendedSprite} from "@/game/factories/sprite/ExtendedSprite.ts";
import {SpriteSheet} from "@/game/factories/sprite/SpriteFactory.ts";
import {enemyType} from "@/game/managers/level/types/wave.ts";

export default class Enemy extends derive(HasBody, CanBeRecycled, ExtendedSprite) implements Positionable, Rotateble, Updateable, Recyclable {

    public constructor(type: enemyType) {
        super(SpriteSheet.Enemies);
    }

    public update(_dt: number) {
        this.syncPosition();
        this.syncRotation();
    }
}
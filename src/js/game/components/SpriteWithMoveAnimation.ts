import {component, field} from "@lastolivegames/becsy";
import type {AnimatedSprite as Sprite} from 'pixi.js';

@component
export default class SpriteWithMoveAnimation {
    //@ts-ignore
    @field.object value: Sprite;
}

import {component, field} from "@lastolivegames/becsy";
import type {AnimatedSprite} from "pixi.js";

@component
export default class Sprite {
    @field.object declare value?: AnimatedSprite;
}
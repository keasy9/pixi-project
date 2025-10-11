import {component, field} from "@lastolivegames/becsy";
import type {AnimatedSprite, Container} from 'pixi.js';

@component
export default class Graphics {
    @field.object declare value?: AnimatedSprite|Container;
}

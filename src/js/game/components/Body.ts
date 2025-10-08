import {component, field} from "@lastolivegames/becsy";
import {Body as PhysicsBody} from "planck";

@component export default class Body {
    @field.object declare value?: PhysicsBody;
}
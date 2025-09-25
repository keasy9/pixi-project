import type {SpriteDecorator} from "@/game/factories/sprite/SpriteDecorator.ts";
import {Body} from "planck";
import type {GameObject} from "@/game/types.ts";

export type BodyUserData = {
    sprite?: SpriteDecorator,
    object: GameObject,
}

export declare class BodyWithUserData extends Body {
    getUserData(): BodyUserData|undefined;
    setUserData(data?: BodyUserData): void;
}
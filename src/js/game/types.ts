import type {BodyWithUserData} from "@/systems/physics/types.ts";

export interface GameObject {
    update(dt: number): void;
}

export interface GameObjectWithPhysics {
    body: BodyWithUserData;
    update(dt: number): void;
}
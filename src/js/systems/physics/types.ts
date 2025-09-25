import type {Sprite} from "@/game/factories/sprite/Sprite.ts";
import type {GameObject} from "@/game/types.ts";

export type BodyUserData = {
    sprite?: Sprite,
    object: GameObject,
}


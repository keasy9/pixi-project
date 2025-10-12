import type {ExtendedSprite} from "@/game/factories/sprite/ExtendedSprite.ts";
import type {Updatable} from "@/game/objects/interfaces/Updatable.ts";

export type BodyUserData = {
    sprite?: ExtendedSprite,
    object?: Updatable,
}


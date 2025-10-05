import type {ExtendedSprite} from "@/game/factories/sprite/ExtendedSprite.ts";
import type {Updateable} from "@/game/types/Updateable.ts";

export type BodyUserData = {
    sprite?: ExtendedSprite,
    object?: Updateable,
}


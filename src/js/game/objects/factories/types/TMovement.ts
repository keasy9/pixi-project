enum MOVEMENT_PATTERN {
    LINEAR = 'linear',
}

type TBaseMovement = {
    pattern: MOVEMENT_PATTERN,
    speed: number,
}

type TLinearMovement = TBaseMovement & {
    angle: number,
}

export type TMovement = TLinearMovement;

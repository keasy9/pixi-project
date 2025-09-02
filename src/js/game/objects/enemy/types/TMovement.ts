export enum MOVEMENT_PATTERN {
    LINEAR = 'linear',
}

type TBaseMovement = {
    pattern: MOVEMENT_PATTERN,
    speed: number,
}

type TLinearMovement = TBaseMovement & { pattern: MOVEMENT_PATTERN.LINEAR };

export type TMovement = TLinearMovement;

export enum MOVEMENT_PATTERN {
    LINEAR = 'linear',
}

type TBaseMovement = {
    pattern: MOVEMENT_PATTERN,
    speed: number,
}

type TLinearMovement = TBaseMovement & {};

export type TMovement = TLinearMovement;

export enum WAVE_SHAPE {
    GRID = 'grid',
}

type TBaseShape = { type: WAVE_SHAPE };

type TGridShape = TBaseShape & {
    type: WAVE_SHAPE.GRID,
    rowGap?: number, // от 0 до 1
    colGap?: number, // от 0 до 1
    maxCols?: number,
}

export type TShape = TGridShape;

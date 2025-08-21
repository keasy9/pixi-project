enum WAVE_SHAPE {
    GRID = 'grid',
}

type TBaseShape = { type: WAVE_SHAPE };

type TGridShape = TBaseShape & {
    type: WAVE_SHAPE.GRID,
    gap: number|Phaser.Geom.Point,
    rows?: number,
    cols?: number,
}

export type TShape = TGridShape;

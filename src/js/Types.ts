export type Class<T> = new (...args: any[]) => T;

export interface GameObject {
    update(dt: number): void;
}

export type FrameConfig = {
    width: number,
    height: number,
    colsCount?: number,
    rowsCount?: number,
}
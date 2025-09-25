export interface GameObject {
    x: number;
    y: number;
    rotation: number;

    update(dt: number): void;
}
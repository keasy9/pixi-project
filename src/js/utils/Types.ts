export type Class<T> = new (...args: any[]) => T;

export interface GameObject {
    update(dt: number): void;
}
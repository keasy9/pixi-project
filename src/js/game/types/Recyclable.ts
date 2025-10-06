export interface Recyclable<T extends object = Record<any, any>> {
    dead: boolean;
    recycle<K extends keyof T>(props: Record<K, T[K]>): void;
}
export type TClass<T = any> = new (...args: any[]) => T;
export type TSize = { width: number, height: number }
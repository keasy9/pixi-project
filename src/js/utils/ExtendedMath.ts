export default class ExtendedMath {
    public readonly E = Math.E;
    public readonly PI = Math.PI;

    public static min(...numbers: number[]): number {
        return Math.min(...numbers);
    }

    public static max(...numbers: number[]): number {
        return Math.max(...numbers);
    }

    public static floor(number: number, precision: number = 2) {
        const multiplier = this.pow(10, precision);
        return Math.floor(number * multiplier) / multiplier;
    }

    public static pow(pow: number, number: number): number {
        return Math.pow(pow, number);
    }

    // Линейная интерполяция
    public static lerp(
        value: number,
        fromLow: number,
        fromHigh: number,
        toLow: number = -1,
        toHigh: number = 1,
        precision: number|false = 2
    ): number {
        const result = toLow + (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow);
        return precision === false ? result : this.floor(result, precision);
    }

    public static clamp(value: number, min: number = -1, max: number = 1) {
        return this.max(this.min(value, max), min);
    }
}

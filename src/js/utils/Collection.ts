export class Collection<T = any> {
    constructor(protected items: T[] = []) { }

    /**
     * Возвращает новую коллекцию, содержащую коллекции по chunkSize элементов
     * @param chunkSize
     */
    public chunk(chunkSize: number): Collection<Collection<T>> {
        const chunked: Collection<T>[] = [];
        for (let i = 0; i < this.items.length; i += chunkSize) {
            chunked.push(collect(this.items.slice(i, i + chunkSize)));
        }

        return collect(chunked);
    }

    public each(cb: (value: T, index: number) => any): this {
        this.items.forEach(cb);

        return this;
    }
}

export function collect<T = any>(items: T[]): Collection<T> {
    return new Collection<T>(items);
}
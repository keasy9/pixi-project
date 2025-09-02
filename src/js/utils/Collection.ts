// todo в отдельный npm-пакет
type TCollectionMergeTarget<T = any> = T[]|Map<any, T>|Set<T>|Record<any, T>;

export class Collection<T = any> extends Map<any, T> {

    /**
     * Возвращает новую коллекцию, содержащую коллекции по chunkSize элементов
     * @param chunkSize
     */
    public chunk(chunkSize: number): Collection<Collection<T>> {
        const entries = Array.from(this.entries());

        const chunked = new Collection();

        let chunkKey = 0;
        for (let i = 0; i < this.size; i += chunkSize) {
            let chunkEntryKey = 0;

            chunked.set(chunkKey, new Collection(
                entries.slice(i, i + chunkSize).map(entry => {
                    if (!isNaN(Number(entry[0]))) {
                        entry[0] = chunkEntryKey;
                        chunkEntryKey++;
                    }

                    return entry;
                }),
            ));

            chunkKey++;
        }

        return chunked;
    }

    /**
     * Итерироваться по всем элементам коллекции
     * @param cb
     */
    public each(cb: (value: T, index: number) => any): this {
        this.forEach(cb);

        return this;
    }

    /**
     * Добавить в коллекцию элементы. При совпадении ключей, элементы будут перезаписаны
     * @param items
     */
    public merge(items: TCollectionMergeTarget<T>): this {
        Array.from(Object.entries(items)).forEach(entry => this.set(entry[0], entry[1]));
        return this;
    }

    /**
     * Посчитать элементы коллекции
     */
    public count(): number {
        return this.size;
    }

    /**
     * Получить последний элемент коллекции
     */
    public get last(): T|undefined {
        if (this.size === 0) return undefined;
        return Array.from(this.entries())[this.size-1][1];
    }

    /**
     * Размер коллекции
     */
    public get length(): number {
        return this.size;
    }
}

export function collect<T = any>(items: TCollectionMergeTarget): Collection<T> {
    return new Collection().merge(items);
}
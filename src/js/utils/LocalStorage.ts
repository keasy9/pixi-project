interface StorageData {
    isDebug: boolean;
}

const defaultValues: Partial<StorageData> = {
    isDebug: false,
};

export default class LocalStorage {
    public get<K extends keyof StorageData>(key: K, defaultValue: StorageData[K]): StorageData[K];
    public get<K extends keyof StorageData>(key: K): StorageData[K]|undefined;
    public get<K extends keyof StorageData>(key: K, defaultValue?: StorageData[K]): StorageData[K]|undefined {
        let val = localStorage.getItem(key);
        if (val) {
            try {
                val = JSON.parse(val);
            } catch (e) {
                val = null;
            }
        }
        return (val as StorageData[K]|null) ?? defaultValue ?? defaultValues[key];
    }

    public set<K extends keyof StorageData>(key: K, value: StorageData[K]): this {
        localStorage.setItem(key, JSON.stringify(value));
        return this;
    }

    public remove<K extends keyof StorageData>(key: K): StorageData[K]|undefined {
        const val = this.get(key);
        localStorage.removeItem(key);
        return val;
    }
}
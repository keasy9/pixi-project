import type {Recyclable} from '@/game/types/Recyclable.ts';

export default class ObjectPool<Entry extends Recyclable, EntryConstructorParams extends any[] = any[]> {
    protected objects: Entry[] = [];

    public constructor(
        protected objectClass: Constructor<Entry, EntryConstructorParams>,
        protected constructorParams: EntryConstructorParams = [] as unknown as EntryConstructorParams, // todo
    ) {}

    public get<K extends keyof Entry>(props: Record<K, Entry[K]> = {} as Record<K, Entry[K]>): Entry {
        let instance = this.objects.find(obj => obj.dead);

        instance ??= new this.objectClass(...this.constructorParams);

        instance.recycle(props);

        return instance;
    }
}
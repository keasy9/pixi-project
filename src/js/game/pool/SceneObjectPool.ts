import type {Recyclable} from '@/game/objects/interfaces/Recyclable.ts';
import type {Constructor} from '@/types.ts';
import ObjectPool from '@/game/pool/ObjectPool.ts';
import type AbstractScene from '@/game/scenes/AbstractScene.ts';
import type {ContainerChild, IRenderLayer} from 'pixi.js';

export default class SceneObjectPool<Entry extends Recyclable&(ContainerChild|IRenderLayer), EntryConstructorParams extends any[] = any[]> extends ObjectPool<Entry, EntryConstructorParams> {

    public constructor(
        protected scene: AbstractScene,
        protected objectClass: Constructor<Entry, EntryConstructorParams>,
        protected constructorParams: EntryConstructorParams = [] as unknown as EntryConstructorParams,
    ) {
        super(objectClass, constructorParams);
    }

    public get<K extends keyof Entry>(props: Record<K, Entry[K]> = {} as Record<K, Entry[K]>): Entry {
        let instance = this.objects.find(obj => obj.dead);

        instance ??= new this.objectClass(...this.constructorParams);

        instance.recycle(props);

        this.scene.addChild(instance);

        return instance;
    }
}
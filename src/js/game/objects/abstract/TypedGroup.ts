import type {TClass} from '@/utils/Types';

// от нативной группы Phaser тличается только типизацией
export class TypedGroup<T extends Phaser.GameObjects.GameObject = Phaser.GameObjects.GameObject> extends Phaser.GameObjects.Group {
    declare children: Phaser.Structs.Set<T>;
    // @ts-ignore
    declare createCallback: ((item: T) => void) | null;
    // @ts-ignore
    declare removeCallback: ((item: T) => void) | null;
    // @ts-ignore
    declare createMultipleCallback: ((item: T) => void) | null;
    // @ts-ignore
    declare classType: TClass<T>;

    public getChildren(): T[] {
        return super.getChildren() as T[];
    }

    public add(child: T, addToScene?: boolean): this {
        return super.add(child, addToScene);
    }

    public addMultiple(children: T[], addToScene?: boolean): this {
        return super.addMultiple(children, addToScene);
    }

    public remove(child: T, removeFromScene?: boolean, destroyChild?: boolean): this {
        return super.remove(child, removeFromScene, destroyChild);
    }

    public contains(child: T): boolean {
        return super.contains(child);
    }

    public kill(gameObject: T): void {
        return super.kill(gameObject);
    }

    public killAndHide(gameObject: T): void {
        return super.killAndHide(gameObject);
    }
}

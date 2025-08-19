import type {TClass} from '@/utils/Types';

export default class ObjectPool<T extends Phaser.GameObjects.GameObject = Phaser.GameObjects.GameObject> extends Phaser.GameObjects.Group {
    declare children: Phaser.Structs.Set<T>;

    constructor(
        scene: Phaser.Scene,
        protected objectType: TClass<T>,
    ) {
        super(scene);

        scene.add.existing(this);
    }

    public make(options: Record<string, any>): T {
        let instance: T;

        instance = this.getFirstDead();
        if (instance) {
            instance.setActive(true);
            if ('setVisible' in instance) (instance as any).setVisible(true);

            if ('body' in instance) {
                (instance.body as Phaser.Physics.Arcade.Body).reset(options.x ?? 0, options.y ?? 0);
            }
        } else {
            instance = new this.objectType(this.scene, ...Object.values(options));
        }

        for (let key in options) {
            if (key in instance && (typeof (instance as any)[key] !== 'function')) {
                (instance as any)[key] = options[key];
            }
        }

        this.add(instance, true);

        return instance;
    }

    public recycle(instance: T): this {
        this.killAndHide(instance);

        return this;
    }
}
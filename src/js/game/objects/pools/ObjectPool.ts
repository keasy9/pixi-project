import type {TClass} from '@/utils/Types';

type TObjectPoolMakeConfig = {
    x?: number,
    y?: number,
    frame?: number
}

export default class ObjectPool<T extends Phaser.GameObjects.GameObject = Phaser.GameObjects.GameObject> extends Phaser.GameObjects.Group {
    declare children: Phaser.Structs.Set<T>;

    // передать в объект при создании фрейм вместо текстуры, на случай если в пуле VariableSprite
    protected provideFrameInsteadOfTexture: boolean = false;

    constructor(
        scene: Phaser.Scene,
        public classType: TClass<T>,
        public defaultKey: string = '',
        public defaultFrame: number = 0,
    ) {
        super(scene);

        scene.add.existing(this);
    }

    public make(config: TObjectPoolMakeConfig = {}): T {
        let texture: string|undefined = this.defaultKey;
        if (this.provideFrameInsteadOfTexture) {
            texture = String(config.frame ?? this.defaultFrame);
        }

        let instance: T = this.getFirstDead(
            true,
            config.x,
            config.y,
            texture,
            config.frame,
            true,
        );

        instance.setActive(true);

        if ('setVisible' in instance) {
            (instance as any).setVisible(true);
        }

        if ('body' in instance) {
            (instance.body as Phaser.Physics.Arcade.Body).reset(config.x ?? 0, config.y ?? 0);
        }

        return instance;
    }
}
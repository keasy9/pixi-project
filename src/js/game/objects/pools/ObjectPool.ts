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
        protected textureKey: string = '',
    ) {
        super(scene);

        scene.add.existing(this);
    }

    public make(config: TObjectPoolMakeConfig = {}): T {
        let instance: T = this.getFirstDead(
            true,
            config.x,
            config.y,
            this.provideFrameInsteadOfTexture ? String(config.frame) : this.textureKey,
            config.frame,
            true,
        );

        if ('body' in instance) {
            (instance.body as Phaser.Physics.Arcade.Body).reset(config.x ?? 0, config.y ?? 0);
        }

        return instance;
    }
}
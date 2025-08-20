import {Game} from '@/game/GameState';

export enum COLLIDER {
    PLAYER,
    ENEMY,
}

class CollisionManager {
    protected groups: {[K in COLLIDER]?: Phaser.GameObjects.Group} = {};

    protected getColliderMap(): {[K in COLLIDER]?: COLLIDER[]} {
        return {
            [COLLIDER.PLAYER]: [COLLIDER.ENEMY],
            [COLLIDER.ENEMY]: [COLLIDER.PLAYER],
        }
    }

    public add(object: Phaser.GameObjects.GameObject, colliderType: COLLIDER): this {
        if (!(colliderType in this.groups)) {
            this.groups[colliderType] = new Phaser.GameObjects.Group(Game.scene);

            this.getColliderMap()[colliderType]?.forEach(collideWith => {
                if (collideWith in this.groups) {
                    //Game.scene.physics.add.collider()
                }
            })
        }

        return this;
    }
}

export const Collider = new CollisionManager();
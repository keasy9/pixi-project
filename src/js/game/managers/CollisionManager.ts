import {Game} from '@/game/GameState';

export enum COLLIDER {
    PLAYER,
    ENEMY,
}

class CollisionManager {

    protected get groups(): {[K in COLLIDER]: Phaser.GameObjects.Group} {
        if (!Game.sceneState.has('collisions')) {
            const collisionGroups = {
                [COLLIDER.PLAYER]: new Phaser.GameObjects.Group(Game.scene),
                [COLLIDER.ENEMY]: new Phaser.GameObjects.Group(Game.scene),
            }

            Game.scene.physics.add.collider(collisionGroups[COLLIDER.PLAYER], collisionGroups[COLLIDER.ENEMY]);

            Game.sceneState.set('collisions', collisionGroups);
        }

        return Game.sceneState.get('collisions');
    }

    public add(object: Phaser.GameObjects.GameObject, colliderType: COLLIDER): this {
        this.groups[colliderType]!.add(object);

        return this;
    }

    public remove(object: Phaser.GameObjects.GameObject, colliderType: COLLIDER): this {
        this.groups[colliderType]!.remove(object);

        return this;
    }
}

export const Collider = new CollisionManager();
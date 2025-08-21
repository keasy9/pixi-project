import {Game} from '@/game/GameState';

export enum COLLIDER {
    PLAYER,
    ENEMY,
    PLAYER_BULLET,
    ENEMY_BULLET,
}

class CollisionManager {
    protected get groups(): {[K in COLLIDER]: Phaser.GameObjects.Group} {
        if (!Game.sceneState.has('collisions')) {
            const collisionGroups = {
                [COLLIDER.PLAYER]: new Phaser.GameObjects.Group(Game.scene),
                [COLLIDER.ENEMY]: new Phaser.GameObjects.Group(Game.scene),
                [COLLIDER.PLAYER_BULLET]: new Phaser.GameObjects.Group(Game.scene),
                [COLLIDER.ENEMY_BULLET]: new Phaser.GameObjects.Group(Game.scene),
            }

            Game.scene.physics.add.collider(collisionGroups[COLLIDER.PLAYER], collisionGroups[COLLIDER.ENEMY]); // игрок должен сталкиваться с врагами
            Game.scene.physics.add.collider(collisionGroups[COLLIDER.PLAYER_BULLET], collisionGroups[COLLIDER.ENEMY_BULLET]); // пули должны уничтожать друг друга
            Game.scene.physics.add.overlap(collisionGroups[COLLIDER.PLAYER], collisionGroups[COLLIDER.ENEMY_BULLET]); // игрок должен получать урон от пуль врага
            Game.scene.physics.add.overlap(collisionGroups[COLLIDER.PLAYER_BULLET], collisionGroups[COLLIDER.ENEMY]); // враги должны получать урон от пуль игрока

            Game.sceneState.set('collisions', collisionGroups);
        }

        return Game.sceneState.get('collisions');
    }

    public add(object: Phaser.GameObjects.GameObject, colliderType: COLLIDER): this {
        this.groups[colliderType].add(object);

        return this;
    }

    public remove(object: Phaser.GameObjects.GameObject, colliderType: COLLIDER): this {
        this.groups[colliderType].remove(object);

        return this;
    }
}

export const Collider = new CollisionManager();
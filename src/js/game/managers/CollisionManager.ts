import {Game} from '@/game/GameState';
import {canProvideDamage, canTakeDamage} from '@/game/objects/Types';

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

            Game.scene.matter.add.collider(collisionGroups[COLLIDER.PLAYER], collisionGroups[COLLIDER.ENEMY], this.onOverlap); // игрок должен сталкиваться с врагами
            Game.scene.matter.add.collider(collisionGroups[COLLIDER.PLAYER_BULLET], collisionGroups[COLLIDER.ENEMY_BULLET]); // пули должны уничтожать друг друга
            Game.scene.matter.add.overlap(collisionGroups[COLLIDER.PLAYER], collisionGroups[COLLIDER.ENEMY_BULLET], this.onOverlap); // игрок должен получать урон от пуль врага
            Game.scene.matter.add.overlap(collisionGroups[COLLIDER.PLAYER_BULLET], collisionGroups[COLLIDER.ENEMY], this.onOverlap); // враги должны получать урон от пуль игрока

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

    protected onOverlap(
        obj1: (Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile),
        obj2: (Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile),
    ): void {
        if (obj1 instanceof Phaser.Physics.Arcade.Body || obj1 instanceof Phaser.Physics.Arcade.StaticBody) obj1 = obj1.gameObject as Phaser.Types.Physics.Arcade.GameObjectWithBody
        if (obj2 instanceof Phaser.Physics.Arcade.Body || obj2 instanceof Phaser.Physics.Arcade.StaticBody) obj2 = obj2.gameObject as Phaser.Types.Physics.Arcade.GameObjectWithBody

        if (canTakeDamage(obj1) && canProvideDamage(obj2)) obj1.takeDamage(obj2.damage);
        if (canTakeDamage(obj2) && canProvideDamage(obj1)) obj2.takeDamage(obj1.damage);
    }

    protected onCollide(
        obj1: (Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile),
        obj2: (Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Tilemaps.Tile),
    ): void {
        if (obj1 instanceof Phaser.Physics.Arcade.Body || obj1 instanceof Phaser.Physics.Arcade.StaticBody) obj1 = obj1.gameObject as Phaser.Types.Physics.Arcade.GameObjectWithBody
        if (obj2 instanceof Phaser.Physics.Arcade.Body || obj2 instanceof Phaser.Physics.Arcade.StaticBody) obj2 = obj2.gameObject as Phaser.Types.Physics.Arcade.GameObjectWithBody

        if (canTakeDamage(obj1) && canProvideDamage(obj2)) obj1.takeDamage(obj2.damage);
        if (canTakeDamage(obj2) && canProvideDamage(obj1)) obj2.takeDamage(obj1.damage);
    }
}

export const Collider = new CollisionManager();
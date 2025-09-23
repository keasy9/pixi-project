import Vector2 = Phaser.Math.Vector2;
import Ship from '@/game/objects/player/Ship';
import {Exhaust, EXHAUST_SIZE} from '@/game/objects/player/Exhaust';
import {POOL, Pool} from '@/game/managers/PoolManager';
import {Bullet} from '@/game/objects/particles/Bullet';
import {Game} from '@/game/GameState';
import type {DamageProvider, DamageTaker, Mortal} from '@/game/objects/Types';

export default class Player extends Phaser.GameObjects.Container implements DamageTaker, Mortal, DamageProvider {
    protected cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    protected fireKey?: Phaser.Input.Keyboard.Key;

    protected ship: Ship;
    protected exhaust: Exhaust[] = [];

    protected speed = 1;

    protected fireTimer: Phaser.Time.TimerEvent;
    protected health: number = 3;

    constructor(scene: Phaser.Scene, x: number, y :number) {
        super(scene, x, y);

        this.ship = new Ship(scene, 0, 0);
        this.add(this.ship);
        
        const exhaust = new Exhaust(scene, 0, 0, EXHAUST_SIZE.DOUBLE);
        this.add(exhaust.setPosition(1, 5));

        this.setSize(this.ship.displayWidth, this.ship.displayHeight);
        scene.matter.add.gameObject(this);

        this.setScale(Game.scale);

        //(this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

        this.cursors = scene.input.keyboard?.createCursorKeys();
        this.fireKey = scene.input.keyboard?.addKey('space');

        this.fireTimer = scene.time.addEvent({
            delay: 300,
            callback: this.fire.bind(this),
            loop: true,
            paused: true,
        });
    }

    protected preUpdate(_time: number, _dt: number) {
        const body = this.body as Phaser.Physics.Arcade.Body;

        const velocity = new Vector2(0, 0);

        if (this.cursors) {

            if (this.cursors.left.isDown) {
                velocity.x = -1;
                this.ship.toLeft();

            } else if (this.cursors.right.isDown) {
                velocity.x = 1;
                this.ship.toRight();

            } else {
                this.ship.toMain();
            }

            if (this.cursors.up.isDown) velocity.y = -1;
            else if (this.cursors.down.isDown) velocity.y = 1;

            velocity.normalize().scale(Game.scale * this.speed);
        }

        this.setVelocity(velocity.x, velocity.y);

        this.fireTimer.paused = !this.fireKey?.isDown;
    }

    public getVelocity(): Vector2
    {
        return (this.body as Phaser.Physics.Arcade.Body).velocity;
    }

    protected fire(): void {
        let bullet = Pool.get(POOL.PLAYER_BULLET, Bullet).make({x: this.x, y: this.y - 1});
        //Collider.add(bullet, COLLIDER.PLAYER_BULLET);
        bullet.fire({ damage: 10 });

        bullet = Pool.get(POOL.PLAYER_BULLET, Bullet).make({x: this.x + 2 * Game.scale, y: this.y - 1});
        //Collider.add(bullet, COLLIDER.PLAYER_BULLET);
        bullet.fire({ damage: 10 });
    }

    public takeDamage(damage: number): void {
        this.health = Math.max(0, this.health - damage);
    }

    public get dead(): boolean {
        return this.health > 0;
    }

    public get damage(): number {
        return 10;
    }
}
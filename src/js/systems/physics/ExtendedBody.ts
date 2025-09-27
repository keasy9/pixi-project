import {Body, type BodyDef} from 'planck';
import type {BodyUserData} from '@/systems/physics/types.ts';
import type {ExtendedSprite} from '@/game/factories/sprite/ExtendedSprite.ts';
import type {GameObject} from '@/game/types.ts';
import type ExtendedWorld from '@/systems/physics/ExtendedWorld.ts';
import FixtureBuilder from '@/systems/physics/FixtureBuilder.ts';

export default class ExtendedBody extends Body {
    public constructor(world: ExtendedWorld, def: BodyDef) {
        // @ts-ignore
        super(world, def);
    }

    protected get userData(): BodyUserData {
        return this.getUserData();
    }

    public setUserData(data?: BodyUserData): this {
        super.setUserData(data);
        return this;
    }

    public getUserData(): BodyUserData {
        const userData = super.getUserData();
        if (!userData) {
            super.setUserData({});
        }
        return super.getUserData() as BodyUserData;
    }

    public setSprite(sprite?: ExtendedSprite): this {
        this.userData.sprite = sprite;
        return this;
    }

    public getSprite(): ExtendedSprite|undefined {
        return this.userData.sprite;
    }

    public setObject(object: GameObject): this {
        this.userData.object = object;
        return this;
    }

    public getObject(): GameObject|undefined {
        return this.userData.object;
    }

    public fixture(): FixtureBuilder {
        return new FixtureBuilder(this);
    }
}
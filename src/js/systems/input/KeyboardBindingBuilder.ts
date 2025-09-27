import InputBinder from '@/systems/input/InputBinder.ts';
import {InputSource, type KeyboardBinding} from '@/systems/input/types.ts';

export default class KeyboardBindingBuilder {
    protected keyCodes: string[] = [];

    public constructor(protected binder: InputBinder) { }

    public keys(...keys: string[]): this {
        this.keyCodes.push(...keys);
        return this;
    }

    public bind(alias: string): KeyboardBinding {
        return this.binder.add(alias, {
            source: InputSource.Keyboard,
            keys: this.keyCodes,
            down: false,
            pressed: false,
            released: false,
            isDown: function () { return this.down; },
            isUp: function () { return !this.down; },
            isPressed: function () { return this.pressed; },
            isReleased: function () { return this.released; },
        });
    }
}

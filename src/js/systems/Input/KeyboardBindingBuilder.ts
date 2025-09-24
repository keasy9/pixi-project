import type {InputBinder} from '@/systems/Input/InputBinder.ts';
import {InputSource, KeyAction, type KeyboardBinding} from '@/systems/Input/types.ts';

export default class KeyboardBindingBuilder {
    protected keyCode?: string;
    protected keyAction?: KeyAction;

    public constructor(protected binder: InputBinder) { }

    public key(key: string): this {
        this.keyCode = key;
        return this;
    }

    public action(action: KeyAction): this {
        this.keyAction = action;
        return this;
    }

    public bind(alias: string): KeyboardBinding {
        return this.binder.add(alias, {
            source: InputSource.Keyboard,
            key: this.keyCode,
            action: this.keyAction,
            down: false,
            isDown: function () { return this.down; },
            isUp: function () { return !this.down; },
        });
    }
}

import KeyboardBindingBuilder from '@/game/systems/input/KeyboardBindingBuilder.ts';
import type {AnyInputBinding} from '@/game/systems/input/types.ts';
import {InputSource} from '@/game/systems/input/types.ts';

export default class InputBinder {
    protected bindings = new Map<string, AnyInputBinding>();
    protected defaultListenerOptions = {passive: true};

    public on() {
        window.addEventListener('keydown', (e) =>  this.onKeyDown(e), this.defaultListenerOptions);
        window.addEventListener('keyup', (e) => this.onKeyUp(e), this.defaultListenerOptions);
    }

    public off() {
        window.removeEventListener('keydown', (e) =>  this.onKeyDown(e));
        window.removeEventListener('keyup', (e) => this.onKeyUp(e));
    }

    protected onKeyDown(event: KeyboardEvent): void {
        this.bindings.forEach(binding => {
            if (
                binding.source === InputSource.Keyboard
                && (binding.keys.length === 0 || binding.keys.indexOf(event.code) !== -1)
            ) {
                binding.pressed = !binding.isDown();
                binding.down = true;
            }
        });
    }

    protected onKeyUp(event: KeyboardEvent): void {
        this.bindings.forEach(binding => {
            if (
                binding.source === InputSource.Keyboard
                && (binding.keys.length === 0 || binding.keys.indexOf(event.code) !== -1)
            ) {
                binding.released = binding.isDown();
                binding.down = false;
            }
        });
    }

    public update(_dt: number): void {
        this.bindings.forEach(binding => {
            if (binding.source === InputSource.Keyboard) {
                binding.pressed = false;
                binding.released = false;
            }
        });
    }

    public add<K extends string, V extends AnyInputBinding>(alias: K, binding: V): typeof binding {
        if (this.bindings.has(alias)) console.warn(`Алиас ввода [${alias}] перезаписан!`);
        this.bindings.set(alias, binding);

        return binding;
    }

    public get(alias: string): AnyInputBinding|undefined {
        return this.bindings.get(alias);
    }

    public getOrFail<T extends AnyInputBinding = AnyInputBinding>(alias: string): T {
        const binding = this.bindings.get(alias);
        if (binding === undefined) throw `Алиас ввода [${alias}] не существует!`;
        return binding as T;
    }

    public keyboard(): KeyboardBindingBuilder {
        return new KeyboardBindingBuilder(this);
    }
}

import KeyboardBindingBuilder from '@/systems/Input/KeyboardBindingBuilder.ts';
import type {AnyInputBinding} from '@/systems/Input/types.ts';
import {InputSource, KeyAction} from '@/systems/Input/types.ts';

export class InputBinder {
    protected bindings = new Map<string, AnyInputBinding>();

    constructor() {
        window.addEventListener('keydown', (event) => {
            this.bindings.forEach(binding => {
                if (
                    binding.source === InputSource.Keyboard
                    && (binding.key === undefined || binding.key === event.key)
                    && (binding.action === undefined || binding.action === KeyAction.Down)
                ) binding.down = false;
            })
        });

        window.addEventListener('keydown', (event) => {
            this.bindings.forEach(binding => {
                if (
                    binding.source === InputSource.Keyboard
                    && (binding.key === undefined || binding.key === event.key)
                    && (binding.action === undefined || binding.action === KeyAction.Up)
                ) binding.down = false;
            })
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

    public getOrFail(alias: string): AnyInputBinding {
        const binding = this.bindings.get(alias);
        if (binding === undefined) throw `Алиас ввода [${alias}] не существует!`;
        return binding;
    }

    public keyboard(): KeyboardBindingBuilder {
        return new KeyboardBindingBuilder(this);
    }
}

export const Input = new InputBinder();

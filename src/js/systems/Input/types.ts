export enum InputSource {
    Keyboard,
}

export interface InputBinding {
    source: InputSource;
}

export interface KeyboardBinding extends InputBinding {
    source: InputSource.Keyboard;
    key?: string;
    action?: KeyAction;
    down: boolean;
    isDown: () => boolean;
    isUp: () => boolean;
}

export type AnyInputBinding = KeyboardBinding;

export enum KeyAction {
    Down,
    Up,
}

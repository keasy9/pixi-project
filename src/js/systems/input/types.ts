export enum InputSource {
    Keyboard,
}

export interface InputBinding {
    source: InputSource;
}

export interface KeyboardBinding extends InputBinding {
    source: InputSource.Keyboard;
    key?: string;
    down: boolean;
    pressed: boolean;
    released: boolean;
    isDown: () => boolean;
    isUp: () => boolean;
    isPressed: () => boolean;
    isReleased: () => boolean;
}

export type AnyInputBinding = KeyboardBinding;

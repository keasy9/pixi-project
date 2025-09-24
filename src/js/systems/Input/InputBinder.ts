interface InputBinding {
    isDown(): boolean;
    isUp(): boolean;
}

class InputBinder {
    protected bindings = new Map<string, InputBinding>();

    constructor() {
        
    }

    public static update(_dt: number) {
        
    }
}


export const Input = new InputBinder();

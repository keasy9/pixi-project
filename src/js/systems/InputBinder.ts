enum InputSource {
    Keyboard,
}

interface InputBinding {
    source: InputSource;
}

interface KeyboardBinding extends InputBinding {
    source: InputSource.keyboard;
    key: string,
    down: boolean,
    isDown: () => boolean,
    isUp: () => boolean,
}

class InputBinder {
    protected bindings = new Map<string, KeyboardBinding>();

    constructor() {
        window.addEventListener('keyup', (event) => {
            this.bindings.forEach(binding => {
                if (binding.source === InputSource.Keyboard && binding.key === event.key) binding.down = true;
            })
        });

        window.addEventListener('keydown', (event) => {
            this.bindings.forEach(binding => {
                if (binding.source === InputSource.Keyboard && binding.key === event.key) binding.down = false;
            })
        });
    }

    // todo придумать удобный построитель с fluent api
}

export const Input = new InputBinder();

import {Container} from 'pixi.js';

export default abstract class AbstractScene extends Container {
    constructor(public readonly label: string) {
        super();
    }

    public update(dt: number): void {
        this.children?.forEach(child => {
            if ('update' in child && (typeof child.update === 'function')) {
                child.update(dt);
            }
        })
    }
}
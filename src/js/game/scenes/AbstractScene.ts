import {Container, type ContainerChild} from 'pixi.js';

export default abstract class AbstractScene<T extends ContainerChild = ContainerChild> extends Container<T> {
    public zIndex: number = 500;
    constructor(public readonly label: string) {
        super();
    }

    public update(dt: number): void {
        this.children?.forEach(child => {
            if ('update' in child && (typeof child.update === 'function')) {
                child.update(dt);
            }
        });
    }
}
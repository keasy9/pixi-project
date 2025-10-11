import {Container, Sprite, Graphics} from 'pixi.js';

//@ts-ignore
export default class GraphicsRoot<C = Container|Sprite|Graphics> extends Container<C> {
    protected applyScaleToChild(child: C, scale: number): void {
        if (child instanceof Container) {
            child.scale = scale;
        } else if (child instanceof Container) {
            child.children?.forEach(c => this.applyScaleToChild(c, scale));
        }
    }

    public applyScale(scale: number): void {
        this.children?.forEach(c => this.applyScaleToChild(c, scale))
    }
}

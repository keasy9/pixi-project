/**
 * Контейнер, в который дети с нулевым origin добавляются у левого верхнего края
 */
export class Container extends Phaser.GameObjects.Container {

    public add<T extends Phaser.GameObjects.GameObject>(child: T[] | T): this {
        this.correctChildPosition(child);

        return super.add(child);
    }

    public addAt<T extends Phaser.GameObjects.GameObject>(child: T[] | T, index?: number): this {
        this.correctChildPosition(child);

        return super.addAt(child, index);
    }

    protected correctChildPosition(child: any): void {
        if (Array.isArray(child)) {
            child.forEach(this.correctChildPosition.bind(this));
            return;
        }

        if ((!('originX' in child) || child.originX === 0) && 'x' in child && 'width' in child) {
            child.x = child.x - child.width/2;
        }

        if ((!('originY' in child) || child.originY === 0) && 'y' in child && 'height' in child) {
            child.y = child.y - child.height/2;
        }
    }
}
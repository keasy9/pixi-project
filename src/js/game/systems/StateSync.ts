import {System, system} from '@lastolivegames/becsy';
import Position from '@/game/components/Position.ts';
import Graphics from '@/game/components/Graphics.ts';

@system
export default class StateSync extends System {
    protected graphicsPosition = this.query(q => q.current.with(Position).read.with(Graphics).write)

    public execute() {
        for (const entity of this.graphicsPosition.current) {
            const graphics = entity.write(Graphics).value;
            if (!graphics) continue;

            const pos = entity.read(Position);
            graphics.x = pos.x;
            graphics.y = pos.y;
        }
    }
}

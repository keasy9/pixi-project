import {System, system} from '@lastolivegames/becsy';
import Position from '@/game/components/Position.ts';
import Speed from '@/game/components/Speed.ts';

@system
export default class Movement extends System {
    protected movable = this.query(q => q.current.with(Speed).read.with(Position).write)

    public execute() {
        for (const entity of this.movable.current) {
            const pos = entity.write(Position);
            const speed = entity.read(Speed);

            if (speed.x) pos.x += speed.x * this.delta;
            if (speed.y) pos.y += speed.y * this.delta;
        }
    }
}

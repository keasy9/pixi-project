import {Game} from "@/game/managers/GameManager.ts";
import type {KeyboardBinding} from "@/game/systems/input/types.ts";
import {Body, CircleShape, type Shape} from 'planck';
import {Container, type EventMode, Graphics} from 'pixi.js';

export default class PhysicsDebug extends Container {
    protected graphics: Graphics;

    public enabled: boolean = false;
    public eventMode?: EventMode = 'none';
    public interactiveChildren: boolean = false;
    public label = 'PhysicsDebug';

    constructor() {
        super();

        this.eventMode = 'none';

        Game.input.keyboard().keys('F8').bind('toggle_debug');

        this.graphics = new Graphics();

        this.graphics.interactiveChildren = false;
        this.graphics.eventMode = 'none';

        this.addChild(this.graphics);

        this.enabled = Game.storage.get('isDebug', false);
    }

    public update() {
        this.graphics.clear();

        if (Game.input.getOrFail<KeyboardBinding>('toggle_debug').isReleased()) {
            this.enabled = !this.enabled;
            Game.storage.set('isDebug', this.enabled);
        }

        if (!this.enabled) return;

        for (let body = Game.physics.getBodyList(); body; body = body.getNext()) {
            for (let fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
                this.drawShape(fixture.getShape(), body);
            }
        }
    }

    protected drawShape(shape: Shape, body: Body) {
        let drawColor = 0xff0000;
        if (body.getType() === 'static') drawColor = 0x0000ff;
        else if (body.getType() === 'kinematic') drawColor = 0x00ff00;

        const fillAlpha = .1;
        const strokeAlpha = .5;

        if (shape.getType() === 'circle') {
            const shapeCenter = (shape as CircleShape).getCenter();
            const bodyCenter = body.getPosition();

            this.graphics.circle(
                Game.physics.worldToScreen(shapeCenter.x + bodyCenter.x),
                Game.physics.worldToScreen(shapeCenter.y + bodyCenter.y),
                Game.physics.worldToScreen(shape.getRadius()),
            );

            this.graphics.fill({alpha: fillAlpha, color: drawColor});
            this.graphics.stroke({width: 1, color: drawColor, alpha: strokeAlpha, pixelLine: true});
        }
    }
}
import {Game} from "@/game/managers/GameManager.ts";
import type {KeyboardBinding} from "@/systems/input/types.ts";
import {CircleShape, type Shape} from "planck";
import {Graphics, RenderTexture, Sprite} from "pixi.js";
import type {BodyWithUserData} from "@/systems/physics/types.ts";
import AbstractScene from "@/game/scenes/AbstractScene.ts";

export default class PhysicsDebug extends AbstractScene {
    protected graphics: Graphics;

    public enabled: boolean = false;
    public eventMode = 'none';
    public zIndex: number = 9999;
    public sortableChildren: boolean = true;
    public interactiveChildren: boolean = false;

    constructor() {
        super('physicsDebug');

        this.eventMode = 'none';

        Game.input.keyboard().key('F1').bind('toggle_debug');

        this.graphics = new Graphics();

        this.graphics.zIndex = 9999;
        this.graphics.sortableChildren = true;

        this.addChild(this.graphics);
    }

    public update() {
        this.graphics.clear();

        if (Game.input.getOrFail<KeyboardBinding>('toggle_debug').isReleased()) this.enabled = !this.enabled;
        if (!this.enabled) return;

        for (let body = Game.physics.getBodyList(); body; body = body.getNext()) {
            for (let fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
                this.drawShape(fixture.getShape(), body);
            }
        }
    }

    protected drawShape(shape: Shape, body: BodyWithUserData) {
        let drawColor = 0xff0000;
        if (body.getType() === 'static') drawColor = 0x0000ff;
        else if (body.getType() === 'kinematic') drawColor = 0x00ff00;

        const fillAlpha = .5;

        if (shape.getType() === 'circle') {
            const shapeCenter = (shape as CircleShape).getCenter();
            const bodyCenter = body.getPosition();

            this.graphics.fill({alpha: fillAlpha, color: drawColor});
            this.graphics.stroke({width: 1, color: drawColor});

            this.graphics.moveTo(
                Game.physics.worldToScreen(bodyCenter.x),
                Game.physics.worldToScreen(bodyCenter.y),
            );

            this.graphics.circle(
                Game.physics.worldToScreen(shapeCenter.x),
                Game.physics.worldToScreen(shapeCenter.y),
                shape.getRadius(),
            );
        }
    }
}
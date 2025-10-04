import {type Body, World} from "planck";
import type {PointData} from "pixi.js";
import {Game, GAME_HEIGHT, GAME_WIDTH} from "@/game/managers/GameManager.ts";
import BodyBuilder from "@/game/systems/physics/BodyBuilder.ts";

const PIXELS_PER_METER = 1;


export default class ExtendedWorld extends World {
    declare _addBody: (body: Body) => void;

    protected bounds: Record<string, Body[]> = {};

    constructor() {
        super({
            gravity: {x: 0, y: 0},
            allowSleep: true, // todo надо ли?
        });
    }

    public pixToMet(pixels: number): number {
        return pixels / PIXELS_PER_METER;
    }

    public metToPix(meters: number): number {
        return meters * PIXELS_PER_METER;
    }

    public worldToScreen(coordinates: number) {
        return Math.floor(this.metToPix(coordinates) * Game.scale);
    }

    public screenToWorld(coordinates: number) {
        return Math.floor(this.pixToMet(coordinates) / Game.scale);
    }

    public worldPosToScreen(worldPos: PointData): PointData {
        return {
            x: this.worldToScreen(worldPos.x),
            y: this.worldToScreen(worldPos.y),
        };
    }

    public screenPosToWorld(screenPos: PointData): PointData {
        return {
            x: this.screenToWorld(screenPos.x),
            y: this.screenToWorld(screenPos.y),
        };
    }

    public addBody(body: Body): this {
        this._addBody(body);
        return this;
    }

    public body(): BodyBuilder {
        return new BodyBuilder();
    }

    public createBounds(
        alias: string,
        x?: number,
        y?: number,
        width?: number,
        height?: number,
        thickness: number = 1,
    ): this {
        if (alias in this.bounds) {
            console.warn(`Алиас границ мира [${alias}] уже существует!`);
            return this;
        }

        x = x ? Math.floor(this.pixToMet(x) / Game.scale) : 0;
        y = y ? Math.floor(this.pixToMet(y) / Game.scale) : 0;
        width = width ? Math.floor(this.pixToMet(width) / Game.scale) : this.pixToMet(GAME_WIDTH);
        height = height ? Math.floor(this.pixToMet(height) / Game.scale) : this.pixToMet(GAME_HEIGHT);

        this.bounds[alias] = [];

        this.bounds[alias].push(
            // низ
            this.body()
                .static()
                .at(x + width / 2, y + height + thickness / 2)
                .toWorld(false)
                .fixture()
                .density(0)
                .friction(.3)
                .box(width + thickness * 2, thickness, false),

            // верх
            this.body()
                .static()
                .at(x + width / 2, y - thickness / 2)
                .toWorld(false)
                .fixture()
                .density(0)
                .friction(.3)
                .box(width + thickness * 2, thickness, false),

            // право
            this.body()
                .static()
                .at(x + width + thickness / 2, y + height / 2)
                .toWorld(false)
                .fixture()
                .density(0)
                .friction(.3)
                .box(thickness, height + thickness * 2, false),

            // лево
            this.body()
                .static()
                .at(x - thickness / 2, y + height / 2)
                .toWorld(false)
                .fixture()
                .density(0)
                .friction(.3)
                .box(thickness, height + thickness * 2, false),
        );

        return this;
    }
}

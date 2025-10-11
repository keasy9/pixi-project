import {component, field} from "@lastolivegames/becsy";

@component
export default class Speed {
    @field.float64 x: number = 0;
    @field.float64 y: number = 0;
}

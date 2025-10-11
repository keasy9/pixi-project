import {component, field} from '@lastolivegames/becsy';

@component
export default class GameState {
    @field.boolean isPlayerSpawned: boolean = false;
}

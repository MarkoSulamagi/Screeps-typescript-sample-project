import {Config} from "./../../config/config";

export interface CreepActionInterface {

    creep: Creep;
    renewStation: Spawn;
    _minLifeBeforeNeedsRenew: number;

    setCreep(creep: Creep): void;
    /**
     * Wrapper for Creep.moveTo() method.
     */
    moveTo(target: RoomPosition|{pos: RoomPosition}): number;
    needsRenew(): boolean;
    tryRenew(): number;
    moveToRenew(): void;

    action(): boolean;
}

export class CreepAction implements CreepActionInterface {

    public creep: Creep = null;
    public renewStation: Spawn = null;

    public _minLifeBeforeNeedsRenew: number = Config.DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL;

    public setCreep(creep: Creep) {
        this.creep = creep;
        this.renewStation = <Spawn>Game.getObjectById(this.creep.memory.renew_station_id);
    }

    public moveTo(target: RoomPosition|{pos: RoomPosition}) {
        return this.creep.moveTo(target);
    }

    public needsRenew(): boolean {
        return (this.creep.ticksToLive < this._minLifeBeforeNeedsRenew);
    }

    public tryRenew(): number {
        return this.renewStation.renewCreep(this.creep);
    }

    public moveToRenew(): void {
        if (this.tryRenew() == ERR_NOT_IN_RANGE) {
            this.moveTo(this.renewStation);
        }
    }

    public action(): boolean {
        return true;
    }
}
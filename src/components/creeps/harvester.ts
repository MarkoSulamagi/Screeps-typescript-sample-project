import {Config} from "./../../config/config";
import {CreepActionInterface, CreepAction} from "./creep-action"

export interface HarvesterInterface {

    targetSource: Source;
    targetEnergyDropOff: Spawn|Structure;

    isBagFull(): boolean;
    tryHarvest(): number;
    moveToHarvest(): void;
    tryEnergyDropOff(): number;
    moveToDropEnergy(): void;

    action(): boolean;
}

export class Harvester extends CreepAction implements HarvesterInterface, CreepActionInterface {

    public targetSource: Source = null;
    public targetEnergyDropOff: Spawn|Structure = null;

    public setCreep(creep: Creep) {
        super.setCreep(creep);

        this.targetSource = <Source>Game.getObjectById(this.creep.memory.target_source_id);
        this.targetEnergyDropOff = <Spawn|Structure>Game.getObjectById(this.creep.memory.target_energy_dropoff_id);
    }

    public isBagFull(): boolean {
        return (this.creep.carry.energy == this.creep.carryCapacity);
    }

    public tryHarvest(): number {
        return this.creep.harvest(this.targetSource);
    }

    public moveToHarvest(): void {
        if (this.tryHarvest() == ERR_NOT_IN_RANGE) {
            this.moveTo(this.targetSource);
        }
    }

    public tryEnergyDropOff(): number {
        return this.creep.transfer(this.targetEnergyDropOff, RESOURCE_ENERGY);
    }

    public moveToDropEnergy(): void {
        if (this.tryEnergyDropOff() == ERR_NOT_IN_RANGE) {
            this.moveTo(this.targetEnergyDropOff);
        }
    }

    public action(): boolean {
        if (this.needsRenew()) {
            this.moveToRenew();
        } else if (this.isBagFull()) {
            this.moveToDropEnergy();
        } else {
            this.moveToHarvest();
        }

        return true
    }


}
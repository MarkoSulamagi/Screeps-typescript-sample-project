interface HarvesterInterface {
    creep: Creep;

    setCreep(creep: Creep): void;
    tryHarvest(target: Source): number;
}

export class Harvester implements HarvesterInterface {

    public creep: Creep = null;

    public setCreep(creep: Creep) {
        this.creep = creep;
    }

    public tryHarvest(target: Source): number {
        return this.creep.harvest(target);
    }

}
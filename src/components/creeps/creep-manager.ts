import {Config} from "./../../config/config";
import {MemoryManager} from "./../../shared/memory-manager";
import {SourceManager} from "./../sources/source-manager";
import {SpawnManager} from "./../spawns/spawn-manager";
import {Harvester} from "./harvester";

export namespace CreepManager {

    export var creeps: { Creep } = null;
    export var creepNames: string[] = [];
    export var creepCount: number = 0;

    export function loadCreeps(): void {
        this.creeps = Game.creeps;
        this.creepCount = _.size(this.creeps);

        _loadCreepNames();

        if (Config.VERBOSE) {
            console.log(this.creepCount + " creeps found in the playground.");
        }
    }

    // TODO: Shouldn't be here
    export function isHarvesterLimitFull(): boolean {
        /**
         * This should have some kind of load balancing. It's not useful to create all the harvesters for all source points at the start.
         */
        //return ((SourceManager.sourceCount * Config.MAX_HARVESTERS_PER_SOURCE) == this.creepCount);
        return (Config.MAX_HARVESTERS_PER_SOURCE == this.creepCount);
    }

    export function createHarvester(): number {
        let bodyParts: string[] = [MOVE, MOVE, CARRY, WORK];
        let name: string = null;
        let properties: any = {
            role: 'harvester',
            target_source_id: SourceManager.getFirstSource().id,
            target_energy_dropoff_id: SpawnManager.getFirstSpawn().id,
            renew_station_id: SpawnManager.getFirstSpawn().id
        };

        var status: number = SpawnManager.getFirstSpawn().canCreateCreep(bodyParts, name);
        if (status == OK) {
            status = SpawnManager.getFirstSpawn().createCreep(bodyParts, name, properties);

            if (Config.VERBOSE) {
                console.log("Started creating new Harvester");
            }
        }

        return status;
    }

    export function harvestersGoToWork(): void {

        let harvesters: Harvester[] = [];
        _.forEach(this.creeps, function(creep: Creep, creepName: string) {
            if (creep.memory.role == 'harvester') {
                let harvester = new Harvester();
                harvester.setCreep(creep);
                // Next move for harvester
                harvester.action();

                // Save harvester to collection
                harvesters.push(harvester);
            }
        });

        if (Config.VERBOSE) {
            console.log(harvesters.length + " harvesters reported on duty today!");
        }

    }

    function _loadCreepNames(): void {
        for (let creepName in creeps) {
            if (creeps.hasOwnProperty(creepName)) {
                creepNames.push(creepName);
            }
        }
    }

}

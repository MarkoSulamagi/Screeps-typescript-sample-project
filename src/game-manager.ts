import {Config} from "./config/config";
import {MemoryManager} from "./shared/memory-manager";
import {RoomManager} from "./components/rooms/room-manager";
import {SpawnManager} from "./components/spawns/spawn-manager";
import {SourceManager} from "./components/sources/source-manager";
import {CreepManager} from "./components/creeps/creep-manager";

/**
 * Singleton object.
 * Since singleton classes are considered anti-pattern in Typescript, we can effectively use namespaces.
 * Namespace's are like internal modules in your Typescript application. Since GameManager doesn't need multiple instances
 * we can use it as singleton.
 */
export namespace GameManager {

    export function globalBootstrap() {
        // Set up your global objects.
        // This method is executed only when Screeps system instantiated new "global".

        // Use this bootstrap wisely. You can cache some of your stuff to save CPU
        // You should extend prototypes before game loop in here.

        RoomManager.loadRooms();
        SpawnManager.loadSpawns();
        SourceManager.loadSources();
    }

    export function loop() {
        // Loop code starts here
        // This is executed every tick

        MemoryManager.loadMemory();
        CreepManager.loadCreeps();

        if (!CreepManager.isHarvesterLimitFull()) {
            CreepManager.createHarvester();

            if (Config.VERBOSE) {
                console.log("Need more harvesters!");
            }
        }

        CreepManager.harvestersGoToWork();
    }

}
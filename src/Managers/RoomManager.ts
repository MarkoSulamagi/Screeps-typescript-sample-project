/// <reference path="../_references.ts" />
/// <reference path="SpawnManager.ts" />
/// <reference path="SourceManager.ts" />
/// <reference path="StructureManager.ts" />



class RoomManager {
	private ticksToAverage = 50;
	constructor(private spawnManager: SpawnManager, private sourceManager: SourceManager, private structureManager: StructureManager) { }
	private registerRoom(name: string) {
		var p0 = performance.now();
		if (Memory.rooms == null) Memory.rooms = {};
		Memory.rooms[name] = {
			tickEnergy: [],
			energyPerTick: 0,
			spawns: [],
			sources: [],
			hostiles: null,
			structures: null,
			infants: null,
			capacity: null,
			creeps: null

		}
		var room = Game.rooms[name];
		var spawns = room.find<Spawn>(FIND_MY_SPAWNS);
		var sources = room.find<Source>(FIND_SOURCES);
		_.pluck(sources, "id").forEach(source => this.sourceManager.registerSource(source));
		_.pluck(spawns, "name").forEach(spawnName => this.spawnManager.registerSpawn(spawnName));
		var lairs = room.find<Structure>(FIND_HOSTILE_STRUCTURES).filter(struct => struct.structureType === STRUCTURE_KEEPER_LAIR);
		lairs.forEach(lair => {
			var source = lair.pos.findClosest<Source>(FIND_SOURCES);
			source.getMemory().forbidden = true;
			Memory.castes[CreepRole.harvester].popLimit -= source.getMemory().miningNodes.length;
			console.log(source.id + " is forbidden because it is too close to a keeper lair");
		});
		Memory.castes[CreepRole.builder].popLimit = 2;
		console.log("registered room " + name + ", time: " + (performance.now() - p0) + "ms");
	}
	main() {
		_.forOwn(Game.rooms, room => {
			if (room.controller.owner.username == "GreatGloop" &&
				Memory.rooms[room.name] == null) this.registerRoom(room.name); 
		});
	}
}
interface RoomMemory {
	tickEnergy: number[];
	energyPerTick: number;
	sources: string[];
	spawns: string[];
	hostiles: DefenceMemory[];
	structures: { [type: string]: string[] }
	infants: { [role: number]: string[] }
	capacity: { [role: number]: number }
	creeps: { [role: number]: string[] }
}
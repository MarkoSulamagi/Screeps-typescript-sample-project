/// <reference path="../_references.ts" />
/// <reference path="SpawnManager.ts" />
/// <reference path="SourceManager.ts" />
/// <reference path="StructureManager.ts" />



class RoomManager {
	private ticksToAverage = 50;
	constructor(private spawnManager: SpawnManager, private sourceManager: SourceManager, private structureManager: StructureManager) { }
	private registerRoom(name: string) {
		var p0 = performance.now();
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
		var roomMemory = Memory.rooms[name];
		var room = Game.rooms[name];
		var spawns = room.find<Spawn>(FIND_MY_SPAWNS);
		var sources = room.find<Source>(FIND_SOURCES);
		Memory.rooms[name] = roomMemory;
		this.spawnManager.initializeRoom(name);
		_.pluck(sources, "id").forEach(source => this.sourceManager.registerSource(source));
		_.pluck(spawns, "name").forEach(spawnName => this.spawnManager.registerSpawn(spawnName));
		console.log("registered room " + name + ", time: " + (performance.now() - p0) + "ms");
	}
	main() {
		this.sourceManager.main();
		this.structureManager.main();
		this.spawnManager.main();
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
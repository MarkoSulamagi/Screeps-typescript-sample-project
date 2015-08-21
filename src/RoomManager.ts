/// <reference path="_references.ts" />
/// <reference path="SourceRoute.ts" />
/// <reference path="Spawn/SpawnManager.ts" />
/// <reference path="Creep/RoleRoomMemory.ts" />
/// <reference path="SourceManager.ts" />



class RoomManager {
	private managerMemory: RoomManagerMemory;
	static memory(name: string): RoomMemory {
		var room = Game.rooms[name];
		return room ? room.memory : null;
	}
	constructor(private spawnManager: SpawnManager, private sourceManager: SourceManager) {
		if (!Memory.roomManager) {
			Memory.roomManager = {rooms: []};
		}
		this.managerMemory = Memory.roomManager;
	}
	registerRoom(name: string) {
		var p0 = performance.now();
		var memory = RoomManager.memory(name);
		if (!memory || memory.role) return;
		memory.role = {};
		for (var role in CreepRole) {
			console.log("registering role " + role);
			memory.role[role] = {creeps: [], infants: [], capacity: 0};
		}
		var room = Game.rooms[name];
		memory.spawns = [];
		var spawns = room.find<Spawn>(FindCode.FIND_MY_SPAWNS);
		_.pluck(spawns, "name").forEach(spawnName => this.spawnManager.registerSpawn(spawnName));
		memory.sources = [];
		var sources = room.find<Source>(FindCode.FIND_SOURCES);
		_.pluck(sources, "id").forEach(source => this.sourceManager.registerSource(source));
		this.managerMemory.rooms.push(name);
		console.log("registered room " + name + ", time: " + (performance.now() - p0) + "ms");
	}
	main() {
		this.managerMemory.rooms.forEach(name => {
			var memory = RoomManager.memory(name);
			memory.spawns.forEach(spawnName => {
				var spawn = Game.spawns[spawnName]
				if (!spawn) {
					console.log(spawnName + " no longer exits, removing from memory");
					memory.spawns.splice(memory.spawns.indexOf(spawnName));
				}
			});
		});
		this.sourceManager.main();
		this.spawnManager.main();
	}
}
interface RoomMemory {
	sources: string[];
	spawns: string[];
	structures: string[];
	role: {[role: number]: RoleRoomMemory};
}
interface RoomManagerMemory {
	rooms: string[];
}

/// <reference path="../_references.ts" />
/// <reference path="SpawnManager.ts" />
/// <reference path="SourceManager.ts" />



class RoomManager {
	constructor(private spawnManager: SpawnManager, private sourceManager: SourceManager) {}
	private registerRoom(name: string) {
		var p0 = performance.now();
		var roomMemory = Memory.rooms[name];
		var room = Game.rooms[name];
		roomMemory.spawns = [];
		this.spawnManager.initializeRoom(name);
		var spawns = room.find<Spawn>(FindCode.FIND_MY_SPAWNS);
		_.pluck(spawns, "name").forEach(spawnName => this.spawnManager.registerSpawn(spawnName));
		roomMemory.sources = [];
		var sources = room.find<Source>(FindCode.FIND_SOURCES);
		_.pluck(sources, "id").forEach(source => this.sourceManager.registerSource(source));
		roomMemory.isRegistered = true;
		console.log("registered room " + name + ", time: " + (performance.now() - p0) + "ms");
	}
	main() {
		for (var roomName in Game.rooms) {
			var memory = Memory.rooms[roomName];
			if (memory.isRegistered == false) this.registerRoom(roomName);
			memory.spawns.forEach(spawnName => {
				var spawn = Game.spawns[spawnName]
				if (!spawn) {
					console.log(spawnName + " no longer exits, removing from memory");
					memory.spawns.splice(memory.spawns.indexOf(spawnName));
				}
			});
		}
		this.sourceManager.main();
		this.spawnManager.main();
	}
}
interface RoomMemory {
	sources: string[];
	spawns: string[];
	structures: string[];
	isRegistered: boolean;
}

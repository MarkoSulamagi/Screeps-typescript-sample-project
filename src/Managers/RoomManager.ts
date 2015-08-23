/// <reference path="../_references.ts" />
/// <reference path="SpawnManager.ts" />
/// <reference path="SourceManager.ts" />



class RoomManager {
	constructor(private spawnManager: SpawnManager, private sourceManager: SourceManager) { }
	private registerRoom(name: string) {
		var p0 = performance.now();
		var roomMemory: any = {};
		var room = Game.rooms[name];
		roomMemory.spawns = [];
		var spawns = room.find<Spawn>(FindCode.FIND_MY_SPAWNS);
		roomMemory.sources = [];
		var sources = room.find<Source>(FindCode.FIND_SOURCES);
		var structures: string[] = [];
		roomMemory.structures = structures;
		Memory.rooms[name] = roomMemory;
		this.spawnManager.initializeRoom(name);
		_.pluck(sources, "id").forEach(source => this.sourceManager.registerSource(source));
		_.pluck(spawns, "name").forEach(spawnName => this.spawnManager.registerSpawn(spawnName));
		console.log("registered room " + name + ", time: " + (performance.now() - p0) + "ms");
	}
	main() {
		for (var roomName in Game.rooms) {
			var memory = Memory.rooms[roomName];
			if (!memory) {
				console.log("needs to register room")
				this.registerRoom(roomName);
				break;
			}
			memory.spawns.forEach(spawnName => {
				var spawn = Game.spawns[spawnName]
				if (!spawn) {
					console.log(spawnName + " no longer exists, removing from memory");
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
}

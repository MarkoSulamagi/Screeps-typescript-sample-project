/// <reference path="_references.ts" />
/// <reference path="SourceRoute.ts" />
/// <reference path="Spawn/SpawnManager.ts" />

class RoomManager {
	private managerMemory: RoomManagerMemory;
	static memory(name: string): RoomMemory {
		var room = Game.rooms[name];
		return room ? room.memory : null;
	}
	constructor(private spawnManager: SpawnManager) {
		if (!Memory.roomManager) {
			Memory.roomManager = {rooms: []};
		}
		this.managerMemory = Memory.roomManager;
	}
	private registerRoom(name: string) {
		var memory = RoomManager.memory(name);
		if (!memory) return;
		memory.harvestRoutes = [];
		var room = Game.rooms[name];
		var spawns = room.find<Spawn>(FindCode.FIND_MY_SPAWNS);
		memory.spawns = _.pluck(spawns, "name");
		memory.spawns.forEach(spawnName => this.spawnManager.registerSpawn(spawnName));
		var sources = room.find<Source>(FindCode.FIND_SOURCES);
		memory.sources = _.pluck(sources, "id");
		this.updateSourcePaths(name);
		this.managerMemory.rooms.push(name);
		console.log("registered room " + name);
	}
	main() {
		if (this.managerMemory.rooms.length < 1) {
			for (var roomName in Game.rooms) {
				this.registerRoom(roomName);
			}
		}
		this.managerMemory.rooms.forEach(name => {
			var memory = RoomManager.memory(name);
			if (!memory) return;
			if (!memory.sources || !memory.spawns || !memory.harvestRoutes) {
				console.log("registering new room " + name);
				this.registerRoom(name);
			}
			memory.spawns.forEach(spawnName => {
				var spawn = Game.spawns[spawnName]
				if (!spawn) {
					console.log(spawnName + " no longer exits, removing from memory");
					memory.spawns.splice(memory.spawns.indexOf(spawnName));
				}
			});
			this.spawnManager.main();
		});
	}
	private updateSourcePaths(name: string) {
		var memory = RoomManager.memory(name);
		if (!memory.sources || memory.sources.length < 1) {
			console.log("room " + name + " has no source data");
		}
		var room = Game.rooms[name];
		memory.sources.forEach(id => {
			var source = Game.getObjectById<Source>(id);
			var spawn = source.pos.findClosest<Spawn>(FindCode.FIND_MY_SPAWNS);
			var morePaths = true;
			while (morePaths) {
				var avoid = _.filter<SourceRoute>(memory.harvestRoutes, route => {
					return route.sourceId == id
				})
					.map(route => {
						return room.getPositionAt(
							route.harvestPos.x,
							route.harvestPos.y);
					});
				var toSpawn = source.pos.findPathTo(spawn, { ignoreCreeps: true, avoid: avoid });
				if (!toSpawn || toSpawn.length == 0) {
					morePaths = false;
					break; 
				}
				toSpawn.pop();
				var atSpawn = room.getPositionAt(toSpawn[toSpawn.length - 1].x, toSpawn[toSpawn.length - 1].y);
				var atSource = room.getPositionAt(toSpawn[0].x, toSpawn[0].y)
				var toSource = atSpawn.findPathTo(atSource, { ignoreCreeps: true, avoid: avoid });
				var existingRoute = _.find(memory.harvestRoutes, route => {
					return route.harvestPos.x == toSpawn[0].x &&
						route.harvestPos.y == toSpawn[0].y
				});
				if (existingRoute) {
					existingRoute.spawnName = spawn.name;
					existingRoute.toSpawn = toSpawn;
					existingRoute.toSource = toSource;
				}
				else {
					memory.harvestRoutes.push({
						sourceId: id,
						spawnName: spawn.name,
						creepName: null,
						harvestPos: {x: toSpawn[0].x, y: toSpawn[0].y},
						toSource: toSource,
						toSpawn: toSpawn});
				}
			}
		});

	}
}
interface RoomMemory {
	sources: string[];
	spawns: string[];
	harvestRoutes: SourceRoute[];
}
interface RoomManagerMemory {
	rooms: string[];
}

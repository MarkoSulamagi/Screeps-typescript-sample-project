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
	registerRoom(name: string) {
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
	}
	main() {
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
						console.log(route.harvestPos.x.toString() + route.harvestPos.y.toString());
						return room.getPositionAt(
							route.harvestPos.x,
							route.harvestPos.y);
					});
				console.log("getting path to spawn");
				var toSpawn = source.pos.findPathTo(spawn, { ignoreCreeps: true, avoid: avoid });
				if (!toSpawn || toSpawn.length == 0) {
					console.log("there are no more paths, this should be the end of the function");
					morePaths = false;
					break; 
				}
				toSpawn.pop();
				var atSpawn = room.getPositionAt(toSpawn[toSpawn.length - 1].x, toSpawn[toSpawn.length - 1].y);
				var atSource = room.getPositionAt(toSpawn[0].x, toSpawn[0].y)
				var toSource = atSpawn.findPathTo(atSource, { ignoreCreeps: true, avoid: avoid });
				var existingRoute = _.find(memory.harvestRoutes, route => {
					console.log(route.harvestPos.x.toString() + route.harvestPos.y.toString());
					console.log(toSpawn[0].x.toString() + toSpawn[0].x.toString());
					return route.harvestPos.x == toSpawn[0].x &&
						route.harvestPos.y == toSpawn[0].y
				});
				if (existingRoute) {
					existingRoute.spawnName = spawn.name;
					existingRoute.toSpawn = toSpawn;
					existingRoute.toSource = toSource;
				}
				else {
					console.log(toSpawn[0].x.toString() + toSpawn[0].x.toString());
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

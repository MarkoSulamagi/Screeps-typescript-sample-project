/// <reference path="_references.ts" />
/// <reference path="SourceRoute.ts" />
/// <reference path="HarvestSpawnManager.ts" />

class RoomManager {
	static memory(name: string): RoomMemory {
		var room = Game.rooms[name];
		return room ? room.memory : null;
	}
	static registerRoom(name: string) {
		var memory = RoomManager.memory(name);
		if (!memory) return;
		memory.harvestRoutes = [];
		var room = Game.rooms[name];
		var spawns = room.find<Spawn>(FindCode.FIND_MY_SPAWNS);
		memory.spawns = _.pluck(spawns, "name");
		var sources = room.find<Source>(FindCode.FIND_SOURCES);
		memory.sources = _.pluck(sources, "id");
		RoomManager.updateSourcePaths(name);
	}
	static main(names: string[]) {
		names.forEach(name => {
			var memory = RoomManager.memory(name);
			if (!memory) return;
			if (!memory.sources || !memory.spawns || !memory.harvestRoutes) {
				console.log("registering new room " + name);
				RoomManager.registerRoom(name);
			}
			memory.spawns.forEach(spawnName => {
				if (!Game.spawns[spawnName]) {
					memory.spawns.splice(memory.spawns.indexOf(spawnName));
				}
			});
			HarvestSpawnManager.main(memory.spawns);
		})
	}
	private static updateSourcePaths(name: string) {
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
				if (!toSpawn) { morePaths = false; break; }
				var toSource = spawn.pos.findPathTo(source, { ignoreCreeps: true, avoid: avoid });
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

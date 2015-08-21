/// <reference path="../_references.ts" />
/// <reference path="HarvestSpawnBehavior.ts" />
/// <reference path="../Creep/CreepManager.ts" />


class SpawnManager {
	private behaviors: ISpawnBehavior[];
	constructor(private creepManager: CreepManager, harvestSpawnBehavior: HarvestSpawnBehavior) {
		this.behaviors = [];
		var harvest = harvestSpawnBehavior;
		this.behaviors.push(harvest);
	}
	registerSpawn(name: string) {
		var p0 = performance.now();
		var spawn = Game.spawns[name];
		var global = RoomManager.memory(spawn.room.name);
		global.spawns.push(name);
		console.log("registered new spawn " + name + ", time: " + (performance.now() - p0) + "ms");
	}
	main() {
		for (var room in Game.rooms) {
			var roomSpawns = RoomManager.memory(room).spawns;
			roomSpawns.forEach(name => {
				if (!Game.spawns[name]) {
					console.log(name + " no longer exists, removing from memory");
					roomSpawns.splice(roomSpawns.indexOf(name));
				}
				this.behaviors.forEach(behavior => behavior.main(name));
			});
		}
		this.creepManager.main();
	}
}
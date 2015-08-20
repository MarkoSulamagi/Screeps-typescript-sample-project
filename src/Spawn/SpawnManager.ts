/// <reference path="../_references.ts" />
/// <reference path="HarvestSpawnBehavior.ts" />
/// <reference path="../Creep/CreepManager.ts" />


class SpawnManager {
	private behaviors: ISpawnBehavior[];
	private managerMemory: SpawnManagerMemory
	constructor(private creepManager: CreepManager, harvestSpawnBehavior: HarvestSpawnBehavior) {
		this.behaviors = [];
		var harvest = harvestSpawnBehavior;
		this.behaviors.push(harvest);
		if (!Memory.spawnManager) {
			Memory.spawnManager = { room: {} };
		}
		this.managerMemory = Memory.spawnManager;
	}
	registerSpawn(name: string) {
		var spawn = Game.spawns[name];
		console.log("found the problem");
		if (!this.managerMemory.room[spawn.room.name] || !_.isNumber(this.managerMemory.room[spawn.room.name].length)) {
			this.managerMemory.room[spawn.room.name] = [];
		}
		console.log("nope not here");
		this.managerMemory.room[spawn.room.name].push(name);
	}
	main() {
		for (var room in Game.rooms) {
			var roomSpawns = this.managerMemory.room[room]
			if (!roomSpawns ||!_.isNumber(roomSpawns.length)) return;
			roomSpawns.forEach(name => {
				if (!Game.spawns[name]) {
					var roomSpawns = this.managerMemory.room[room];
					roomSpawns.splice(roomSpawns.indexOf(name));
				}
				this.behaviors.forEach(behavior => behavior.main(name));
			});
		}
		this.creepManager.main();
	}
}
interface SpawnManagerMemory {
	room: { [name: string] : string[] };
}
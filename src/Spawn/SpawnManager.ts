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
			Memory.spawnManager = { castes: [], role: {} };
			var noneNum: number = CreepRole.none;
			Memory.spawnManager.role[noneNum] = [];
			var harvestNum: number = harvest.role;
			Memory.spawnManager.role[harvestNum] = [];
		}
	}
	registerSpawn(name: string) {
		var spawn = Game.spawns[name];
		if (!this.managerMemory.room[spawn.room.name].length) {
			this.managerMemory.room[spawn.room.name] = [];
		}
		this.managerMemory.room[spawn.room.name].push(name);
	}
	applyBehavior(name: string, role: CreepRole) {
		
	}
	main() {
		for (var room in Game.rooms) {
			var roomSpawns = this.managerMemory.room[room]
			if (!roomSpawns.length) return;
			roomSpawns.forEach(name => {
				if (Game.spawns[name]) {
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
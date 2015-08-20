/// <reference path="_references.ts" />
/// <reference path="SpawnManager.ts" />
/// <reference path="HarvestCreepManager.ts" />

class HarvestSpawnManager extends SpawnManager {
	static registerSpawn(name: string) {
		var memory = this.memory(name);
		var spawn = Game.spawns[name];
		var availableSourcePaths = _.filter(RoomManager.memory(spawn.room.name).harvestRoutes, route => {
			return route.creepName = null;
		}).length;
		memory.castes.push({
			name: "harvester",
			quota: availableSourcePaths,
			blueprint: ["move", "work", "carry"],
			children: []});
	}
	static main(names: string[]) {
		super.main(names);
		names.forEach(name => {
			var memory = SpawnManager.memory(name);
			if (!memory.castes.some(caste => { return caste.name == "harvester"})) {
				console.log("registering " + name + " as harvest spawn");
				HarvestSpawnManager.registerSpawn(name);
			}
			HarvestCreepManager.main(_.find(memory.castes, caste => { return caste.name == "harvester"}).children);
		});
	}
}
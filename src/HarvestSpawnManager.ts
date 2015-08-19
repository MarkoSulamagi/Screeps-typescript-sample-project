/// <reference path="_references.ts" />
/// <reference path="SpawnManager.ts" />
/// <reference path="HarvestCreepManager.ts" />

class HarvestSpawnManager extends SpawnManager {
	static registerSpawn(name: string) {
		var memory = this.memory(name);
		memory.castes.push({
			name: "harvester",
			quota: 3,
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
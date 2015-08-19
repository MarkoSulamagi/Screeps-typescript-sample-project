/// <reference path="_references.ts" />
class HarvestSpawnManager extends SpawnManager {
	static registerSpawn(name: string) {
		var memory = this.memory(name);
		memory.castes.push({
			name: "harvester",
			quota: 3,
			blueprint: ["WORK,CARRY,MOVE"],
			children: []});
	}
	static main(names: string[]) {
		names.forEach(name => {
			var memory = SpawnManager.memory(name);
			if (!memory.castes.some(caste => { return caste.name == "harvester"})) {
				this.registerSpawn(name);
			}
			HarvestCreepManager.main(_.find(memory.castes, caste => { return caste.name == "harvester"}).children);
		});
	}
}
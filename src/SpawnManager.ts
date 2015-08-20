/// <reference path="_references.ts" />
/// <reference path="CreepManager.ts" />

class SpawnManager {
	static memory(name: string): SpawnMemory {
		var spawn = Game.spawns[name]
		return spawn ? spawn.memory : null;
	}
	static registerSpawn(name: string) {
		var memory = this.memory(name);
		memory.role = SpawnRole.none;
		memory.status = SpawnStatus.idle;
		memory.castes = [];
		memory.children = [];
	}
	static main(names: string[]) {
		names.forEach(name => {
			var memory = SpawnManager.memory(name);
			if (!memory) {
				console.log(name + " not found in memory");
				return;
			}
			if (!_.isNumber(memory.role)) {
				console.log("registering spawn " + name);
				SpawnManager.registerSpawn(name);
			}
			var spawn = Game.spawns[name];
			if (!spawn) {
				console.log("spawn object for " + name + " is undefined");
			}
			if (memory.castes.length < 1) {
				console.log(name + " has no castes")
			}
			memory.castes.forEach(caste => {
				if (caste.children.length < caste.quota) {
					var result = spawn.createCreep(caste.blueprint, null, { status: CreepStatus.idle })
					if (_.isString(result)) {
						console.log("created new child " + result.toString());
						memory.children.push(result.toString());
						caste.children.push(result.toString());
					}
					else if(result != -4 && result != -6){
						console.log(name + " failed to create " + caste.name + ", error code: " + result.toString())
					}
				}
			});
		});
	}
}
interface SpawnMemory {
	role: SpawnRole;
	status: SpawnStatus;
	castes: Caste[];
	children: string[];
}
interface Caste {
	name: string;
	quota: number,
	blueprint: any[];
	children: string[];
}
enum SpawnRole {
	none,
	harvest
}
enum SpawnStatus {
	idle
}
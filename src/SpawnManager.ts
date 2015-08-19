/// <reference path="_references.ts" />
class SpawnManager {
	static memory(name: string): SpawnMemory {
		return Game.spawns[name].memory;
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
			if (!memory) return;
			if (!memory.role) {
				this.registerSpawn(name);
			}
			var spawn = Game.spawns[name];
			memory.castes.forEach(caste => {
				if (caste.children.length < caste.quota) {
					if (spawn.canCreateCreep(caste.blueprint)) {
						var result = spawn.createCreep(caste.blueprint, null, {status: CreepStatus.idle})
						if (_.isString(result)) {
							memory.children.push(result.toString());
							caste.children.push(result.toString());
						}
					}
				}
			});
			CreepManager.main(memory.children);
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
	blueprint: string[];
	children: string[];
}
enum SpawnRole {
	none,
	harvest
}
enum SpawnStatus {
	idle
}
/// <reference path="_references.ts" />
class SpawnManager {
	static memory(name: string): SpawnMemory {
		return Game.spawns[name].memory;
	}
	static registerSpawn(name: string) {
		var memory = this.memory(name);
		memory.role = SpawnRole.none;
		memory.status = SpawnStatus.idle;
		memory.children = [];
	}
	
}
interface SpawnMemory {
	role: SpawnRole;
	status: SpawnStatus;
	children: string[];
}
enum SpawnRole {
	none,
	harvest
}
enum SpawnStatus {
	idle
}
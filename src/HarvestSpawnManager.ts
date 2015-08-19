/// <reference path="_references.ts" />
class HarvestSpawnManager {
	static registerHarvestSpawn(name: string) {
		SpawnManager.registerSpawn(name);
		var memory = SpawnManager.memory(name);
		memory.harvest = { status: HarvestSpawnStatus.idle };
	}
}
interface SpawnMemory {
	harvest: HarvestSpawnMemory;
}
interface HarvestSpawnMemory {
	status: HarvestSpawnStatus;
}
enum HarvestSpawnStatus {
	idle
}
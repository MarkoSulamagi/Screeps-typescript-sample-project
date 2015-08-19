/// <reference path="_references.ts" />
/// <reference path="HarvestSpawnManager.ts" />

class SimulationGame {
	static main() {
		var spawnNames = _.keys(Game.spawns);
		HarvestSpawnManager.main(spawnNames);
	}
}
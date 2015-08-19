/// <reference path="_references.ts" />
class SimulationGame {
	static main() {
		console.log("Simulation main loop");
		var spawnNames = _.keys(Game.spawns);
		console.log(spawnNames);
		HarvestSpawnManager.main(spawnNames);
	}
}
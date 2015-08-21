/// <reference path="_references.ts" />
/// <reference path="RoomManager.ts" />
/// <reference path="Spawn/SpawnManager.ts" />
class SimulationGame {
	harvestCreepBehavior: HarvestCreepBehavior;
	combatCreepBehavior: CombatCreepBehavior;
	creepManager: CreepManager;
	harvestSpawnBehavior: HarvestSpawnBehavior;
	spawnManager: SpawnManager;
	sourceManager: SourceManager;
	roomManager: RoomManager;
	constructor() {
		this.harvestCreepBehavior = new HarvestCreepBehavior();
		this.combatCreepBehavior = new CombatCreepBehavior();
		this.creepManager = new CreepManager(this.harvestCreepBehavior, this.combatCreepBehavior);
		this.harvestSpawnBehavior = new HarvestSpawnBehavior(this.creepManager);
		this.spawnManager = new SpawnManager(this.creepManager, this.harvestSpawnBehavior);
		this.sourceManager = new SourceManager();
		this.roomManager = new RoomManager(this.spawnManager, this.sourceManager);
	}
	main() {
		var t0 = performance.now();
		for (var roomName in Game.rooms) {
			this.roomManager.registerRoom(roomName);
		}
		this.roomManager.main();
		var t1 = performance.now();
		if ((t1 - t0) > 10) {
			console.log("expensive tick, time: " + (t1 - t0) + "ms");
		}
	}
}
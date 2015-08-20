/// <reference path="_references.ts" />
/// <reference path="RoomManager.ts" />
/// <reference path="Spawn/SpawnManager.ts" />
class SimulationGame {
	harvestCreepBehavior: HarvestCreepBehavior;
	combatCreepBehavior: CombatCreepBehavior;
	creepManager: CreepManager;
	harvestSpawnBehavior: HarvestSpawnBehavior;
	spawnManager: SpawnManager;
	roomManager: RoomManager;
	constructor() {
		this.harvestCreepBehavior = new HarvestCreepBehavior();
		this.combatCreepBehavior = new CombatCreepBehavior();
		this.creepManager = new CreepManager(this.harvestCreepBehavior, this.combatCreepBehavior);
		this.harvestSpawnBehavior = new HarvestSpawnBehavior(this.creepManager);
		this.spawnManager = new SpawnManager(this.creepManager, this.harvestSpawnBehavior);
		this.roomManager = new RoomManager(this.spawnManager);		
	}
	main(){
		for (var roomName in Game.rooms) {
			this.roomManager.registerRoom(roomName);
		}
		this.roomManager.main();
	}
}
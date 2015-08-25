/// <reference path="../Castes/HarvestCaste.ts" />
/// <reference path="../Castes/CombatCaste.ts" />
/// <reference path="../Castes/BuilderCaste.ts" />
/// <reference path="CreepManager.ts" />
/// <reference path="RoomManager.ts" />
/// <reference path="SpawnManager.ts" />
class GameManager {
	harvestCaste: HarvestCaste;
	combatCaste: CombatCaste;
	builderCaste: BuilderCaste;
	creepManager: CreepManager;
	spawnManager: SpawnManager;
	sourceManager: SourceManager;
	structureManager: StructureManager
	roomManager: RoomManager;
	constructor() {
		this.harvestCaste = new HarvestCaste();
		this.combatCaste = new CombatCaste();
		this.builderCaste = new BuilderCaste();
		this.creepManager = new CreepManager([this.harvestCaste, this.combatCaste, this.builderCaste]);
		this.spawnManager = new SpawnManager(this.creepManager);
		this.sourceManager = new SourceManager();
		this.structureManager = new StructureManager
		this.roomManager = new RoomManager(this.spawnManager, this.sourceManager, this.structureManager);
	}
	main() {
		this.roomManager.main();
	}
}
interface Memory {
	game: GameMemory
}
interface GameMemory {
	tickTime: number[];
	isRegistered: boolean;
}
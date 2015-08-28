/// <reference path="../Castes/HarvestCaste.ts" />
/// <reference path="../Castes/CombatCaste.ts" />
/// <reference path="../Castes/BuilderCaste.ts" />
/// <reference path="CasteManager.ts" />
/// <reference path="RoomManager.ts" />
/// <reference path="SpawnManager.ts" />
/// <reference path="PathingManager.ts" />

class GameManager {
	pathingManager: PathingManager
	harvestCaste: HarvestCaste;
	combatCaste: CombatCaste;
	builderCaste: BuilderCaste;
	casteManager: CasteManager;
	spawnManager: SpawnManager;
	sourceManager: SourceManager;
	structureManager: StructureManager
	roomManager: RoomManager;
	constructor() {
		this.pathingManager = new PathingManager();
		this.harvestCaste = new HarvestCaste();
		this.combatCaste = new CombatCaste();
		this.builderCaste = new BuilderCaste();
		this.casteManager = new CasteManager([this.harvestCaste, this.combatCaste, this.builderCaste]);
		this.spawnManager = new SpawnManager(this.casteManager);
		this.sourceManager = new SourceManager();
		this.structureManager = new StructureManager
		this.roomManager = new RoomManager(this.spawnManager, this.sourceManager, this.structureManager);
	}
	main() {
		this.pathingManager.main();
		this.roomManager.main();
		this.sourceManager.main();
		this.structureManager.main();
		this.spawnManager.main();
		this.casteManager.main();
	}
}
interface Memory {
	game: GameMemory
}
interface GameMemory {
	tickTime: number[];
	isRegistered: boolean;
}
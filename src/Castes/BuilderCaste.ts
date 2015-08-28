/// <reference path="../_references.ts" />
/// <reference path="../Managers/CasteManager.ts" />
/// <reference path="../Managers/SpawnManager.ts" />
/// <reference path="ICaste.ts" />
/// <reference path="../Util.ts" />



class BuilderCaste implements ICaste {
	role: CreepRole;
	minimumCost: number;
	baseWeight: number;
	constructor() {
		this.role = CreepRole.builder;
		this.minimumCost = 200;
		this.baseWeight = .5;
	}
	getBlueprint(energy: number) {
		if (energy < 200) return null;
		var blueprint = [MOVE, CARRY, WORK];
		energy = energy - 200;
		while(energy >= 50) {
			if (energy >= 50) {
				blueprint.push(MOVE);
				energy = energy - 50;
			}
			if (energy >= 50) {
				blueprint.push(CARRY);
				energy = energy - 50;
			}
			if (energy >= 100) {
				blueprint.push(WORK);
				energy = energy - 100
			}
		}
		return blueprint;
	}
	applyBehavior(name: string) {
		return OK;
	}
	disposeBehavior(name: string) {
		return OK;
	}
	main(name: string) {
		_.forOwn(Memory.construction, (siteMemory, id) => {
			var site = Game.getObjectById<ConstructionSite>(id);
			
		})
		return OK;
	}
}
interface Memory {
	builders: {[name: string]: BuilderMemory}
}
interface BuilderMemory {
	status: BuilderStatus;
	target: string;
	structureType: string;
}
enum BuilderStatus {
	idle,
	building,
	resupplying,
	repairing
}
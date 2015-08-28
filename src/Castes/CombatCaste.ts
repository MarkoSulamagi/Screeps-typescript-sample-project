/// <reference path="../_references.ts" />
/// <reference path="../Managers/CasteManager.ts" />
/// <reference path="ICaste.ts" />



class CombatCaste implements ICaste {
	role: CreepRole;
	minimumCost: number;
	baseWeight: number;
	constructor() {
		this.role = CreepRole.combat;
		this.minimumCost = 130;
		this.baseWeight = .6;
	}
	getBlueprint(energy: number) {
		if(energy < 130) return null;
		var blueprint = [MOVE, ATTACK];
		energy = energy - 130;
		while(energy >= 50) {
			if (energy >= 50) {
				blueprint.push(MOVE);
				energy = energy - 50;
			}
			if (energy >= 80) {
				blueprint.push(ATTACK);
				energy = energy - 80;
			}
		}
		return blueprint;
	}
	applyBehavior(name: string) {
		var creep = Game.creeps[name];
		if (!creep) { return ERR_INVALID_ARGS; }
		var memory = Memory.creeps[name];
		memory.role = CreepRole.combat;
		console.log("applied combat behavior to " + name);
		return OK;
	}
	disposeBehavior(name: string) {
		console.log("removed combat behavior from " + name);
		return OK;
	}
	main(name: string) {
		var memory = Memory.creeps[name];
		var creep = Game.creeps[name];
		var enemies = creep.room.find<Creep>(FIND_HOSTILE_CREEPS);
		if (!_.isNumber(enemies.length)) return OK;
		return creep.moveTo(enemies.pop());
	}
}
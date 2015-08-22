/// <reference path="../_references.ts" />
/// <reference path="../Creep/CreepRole.ts" />
/// <reference path="../Managers/CreepManager.ts" />
/// <reference path="ICaste.ts" />



class CombatCaste implements ICaste {
	role = CreepRole.combat;
	minimumCost = 130;
	baseWeight = .6;
	getBlueprint(energy: number) {
		if(energy < 130) return null;
		var blueprint = ["move", "attack"];
		energy = energy - 130;
		while(energy > 50) {
			if (energy > 50) {
				blueprint.push("move");
				energy = energy - 50;
			}
			if (energy > 80) {
				blueprint.push("attack");
				energy = energy - 80;
			}
		}
	}
	applyBehavior(name: string) {
		var creep = Game.creeps[name];
		if (!creep) { return ResultCode.ERR_INVALID_ARGS; }
		var memory = Memory.creeps[name];
		memory.role = CreepRole.combat;
		console.log("applied combat behavior to " + name);
		return ResultCode.OK;
	}
	disposeBehavior(name: string) {
		console.log("removed combat behavior from " + name);
		return ResultCode.OK;
	}
	main(name: string) {
		var memory = Memory.creeps[name];
		var creep = Game.creeps[name];
		var enemies = creep.room.find<Creep>(FindCode.FIND_HOSTILE_CREEPS);
		if (!_.isNumber(enemies.length)) return ResultCode.OK;
		return creep.moveTo(enemies.pop());
	}
}
/// <reference path="../_references.ts" />
/// <reference path="ICreepBehavior.ts" />

class CombatCreepBehavior implements ICreepBehavior {
	role: CreepRole;
	constructor() {
		this.role = CreepRole.combat;
	}
	applyBehavior(name: string) {
		var creep = Game.creeps[name];
		if (!creep) { return ResultCode.ERR_INVALID_ARGS; }
		var memory = CreepManager.memory(name);
		memory.role = CreepRole.combat;
		return ResultCode.OK;
	}
	main(name: string) {
		var memory = CreepManager.memory(name);
		var creep = Game.creeps[name];
		var enemies = creep.room.find<Creep>(FindCode.FIND_HOSTILE_CREEPS);
		if (!_.isNumber(enemies.length)) return ResultCode.OK;
		return creep.moveTo(enemies.pop());
	}
}
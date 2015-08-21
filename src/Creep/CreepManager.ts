/// <reference path="HarvestCreepBehavior.ts" />
/// <reference path="CombatCreepBehavior.ts" />


class CreepManager {
	private behaviors: ICreepBehavior[];
	constructor(harvestBehavior: HarvestCreepBehavior, combatBehavior: CombatCreepBehavior) {
		this.behaviors = [];
		this.behaviors.push(harvestBehavior);
		this.behaviors.push(combatBehavior);
	}
	static memory(name: string): CreepMemory {
		var creep = Game.creeps[name]
		return creep ? creep.memory : null;
	}
	registerCreep(name: string) {
		var p0 = performance.now();
		var memory = CreepManager.memory(name);
		var creep = Game.creeps[name];
		memory.role = _.isNumber(memory.role) ? memory.role : CreepRole.none
		memory.status = CreepStatus.idle;
		var roleNum: number = memory.role;
		var global = RoomManager.memory(creep.room.name).role[roleNum];
		global.creeps.push(name);
		console.log("registered creep " + name + ", time: " + (performance.now() - p0) + "ms");
	}
	applyBehavior(name: string, role: CreepRole) {
		var p0 = performance.now();
		var creep = Game.creeps[name];
		var behavior = _.find(this.behaviors, { "role": role });
		var currentRoleNum: number = CreepManager.memory(name).role;
		var currentRole = RoomManager.memory(creep.room.name).role[currentRoleNum];
		behavior.applyBehavior(name);
		currentRole.creeps.splice(currentRole.creeps.indexOf(name));
		var newRole = RoomManager.memory(creep.room.name).role[role];
		newRole.creeps.push(name);
		console.log("applied behavior " + role + " to creep " + name + ", time: " + (performance.now() - p0) + "ms");
	}
	/**
	 * Checks input id list for creeps that have spawning status but are finished
	 * @param ids list of creep ids to check
	 * @returns returns the list of objects that are still spawning, not creeps, or that don't have a status of spawning
	 */
	main() {
		this.behaviors.forEach(behavior => {
			var roleNum: number = behavior.role;
			for (var roomName in Game.rooms) {
				var global = RoomManager.memory(roomName).role[roleNum];
				global.creeps.forEach(name => {
					var creep = Game.creeps[name];
					if (!creep) {
						console.log(name + " no longer exits, removing from memory");
						var roleCreeps = global.creeps;
						roleCreeps.splice(roleCreeps.indexOf(name));
						return;
					}
					var memory = CreepManager.memory(name);
					if (!_.isNumber(memory.role)) this.registerCreep(name);
					behavior.main(name);
				});
			}
		});
	}
}
interface CreepMemory {
	role: CreepRole;
	status: CreepStatus;
}
class BodyParts {
	static MOVE = "move";
	static WORK = "work";
	static CARRY = "carry";
	static ATTACK = "attack";
	static RANGED_ATTACK = "ranged_attack";
	static TOUGH = "tough";
	static HEAL = "heal";
}
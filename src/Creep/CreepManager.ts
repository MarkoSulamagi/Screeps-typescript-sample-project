/// <reference path="HarvestCreepBehavior.ts" />
/// <reference path="CombatCreepBehavior.ts" />


class CreepManager {
	private behaviors: ICreepBehavior[];
	private managerMemory: CreepManagerMemory;
	constructor(harvestBehavior: HarvestCreepBehavior, combatBehavior: CombatCreepBehavior) {
		this.behaviors = [];
		this.behaviors.push(harvestBehavior);
		var combat = new CombatCreepBehavior(this)
		this.behaviors.push(combatBehavior);
		if (!Memory.creepManager) {
			Memory.creepManager = { room: {} };
			var noneNum: number = CreepRole.none;
			Memory.creepManager.role[noneNum] = [];
			var combatNum: number = combatBehavior.role;
			Memory.creepManager.role[combatNum] = [];
			var harvestNum: number = harvestBehavior.role;
			Memory.creepManager.role[harvestNum] = [];
		}
		this.managerMemory = Memory.creepManager;
	}
	static memory(name: string): CreepMemory {
		var creep = Game.creeps[name]
		return creep ? creep.memory : null;
	}
	registerCreep(name: string) {
		var memory = CreepManager.memory(name);
		var creep = Game.creeps[name];
		memory.role = _.isNumber(memory.role) ? memory.role : CreepRole.none
		memory.status = CreepStatus.idle;
		var roleNum: number = memory.role;
		if (this.managerMemory.room[creep.room.name]) {
			this.managerMemory.room[creep.room.name] = { role: {} };
		}
		if (!this.managerMemory.room[creep.room.name].role[roleNum].length) {
			this.managerMemory.room[creep.room.name].role[roleNum] = [];
		}
		this.managerMemory.room[creep.room.name].role[roleNum].push(name);
	}
	applyBehavior(name: string, role: CreepRole) {
		var creep = Game.creeps[name];
		var behavior = _.find(this.behaviors, { "role": CreepRole });
		var currentRoleNum: number = CreepManager.memory(name).role;
		if (this.managerMemory.room[creep.room.name]) {
			this.managerMemory.room[creep.room.name] = { role: {} };
		}
		if (!this.managerMemory.room[creep.room.name].role[currentRoleNum].length) {
			this.managerMemory.room[creep.room.name].role[currentRoleNum] = [];
		}
		behavior.applyBehavior(name);
		this.managerMemory.room[creep.room.name].role[currentRoleNum].splice(this.managerMemory.room[creep.room.name].role[currentRoleNum].indexOf(name));
		var roleNum: number = role;
		if (!this.managerMemory.room[creep.room.name].role[roleNum].length) {
			this.managerMemory.room[creep.room.name].role[roleNum] = [];
		}
		var roleArray = this.managerMemory.room[creep.room.name].role[roleNum].push(name);
	}
	/**
	 * Checks input id list for creeps that have spawning status but are finished
	 * @param ids list of creep ids to check
	 * @returns returns the list of objects that are still spawning, not creeps, or that don't have a status of spawning
	 */
	main() {
		this.behaviors.forEach(behavior => {
			var roleNum: number = behavior.role;
			for (var roomName in this.managerMemory.room) {
				this.managerMemory.room[roomName].role[roleNum].forEach(name => {
					if (!CreepManager.memory(name)) {
						var roleCreeps = this.managerMemory.room[roomName].role[roleNum];
						roleCreeps.splice(roleCreeps.indexOf(name));
					}
					if (Game.creeps[name].spawning) return ResultCode.ERR_BUSY;
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
interface CreepManagerMemory {
	room: { [key: string]: RoomCreepManagerMemory };
	rooms: string[];
}
interface RoomCreepManagerMemory {
	role: { [key: number]: string[] };
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
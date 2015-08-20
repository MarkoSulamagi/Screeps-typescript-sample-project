/// <reference path="HarvestCreepBehavior.ts" />
/// <reference path="CombatCreepBehavior.ts" />


class CreepManager {
	private behaviors: ICreepBehavior[];
	private managerMemory: CreepManagerMemory;
	constructor(harvestBehavior: HarvestCreepBehavior, combatBehavior: CombatCreepBehavior) {
		this.behaviors = [];
		this.behaviors.push(harvestBehavior);
		this.behaviors.push(combatBehavior);
		if (!Memory.creepManager) {
			Memory.creepManager = { room: {} };
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
		if (!this.managerMemory.room[creep.room.name]) {
			this.managerMemory.room[creep.room.name] = { role: {} };
		}
		if (!this.managerMemory.room[creep.room.name].role[roleNum] || !_.isNumber(this.managerMemory.room[creep.room.name].role[roleNum].length)) {
			this.managerMemory.room[creep.room.name].role[roleNum] = [];
		}
		this.managerMemory.room[creep.room.name].role[roleNum].push(name);
		console.log("registered creep " + name);
	}
	applyBehavior(name: string, role: CreepRole) {
		var creep = Game.creeps[name];
		var behavior = _.find(this.behaviors, { "role": role });
		var currentRoleNum: number = CreepManager.memory(name).role;
		if (!this.managerMemory.room[creep.room.name]) {
			this.managerMemory.room[creep.room.name] = { role: {} };
		}
		if (!this.managerMemory.room[creep.room.name].role[currentRoleNum]) {
			this.managerMemory.room[creep.room.name].role[currentRoleNum] = [];
		}
		behavior.applyBehavior(name);
		this.managerMemory.room[creep.room.name].role[currentRoleNum].splice(this.managerMemory.room[creep.room.name].role[currentRoleNum].indexOf(name));
		var roleNum: number = role;
		if (!this.managerMemory.room[creep.room.name].role[roleNum]) {
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
				if (!this.managerMemory.room[roomName].role[roleNum]) {
					this.managerMemory.room[roomName].role[roleNum] = [];
				}
				this.managerMemory.room[roomName].role[roleNum].forEach(name => {
					var creep = Game.creeps[name];
					if (!creep) {
						var roleCreeps = this.managerMemory.room[roomName].role[roleNum];
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
interface CreepManagerMemory {
	room: { [key: string]: RoomCreepManagerMemory };
	rooms: string[];
	spawning: string[];
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
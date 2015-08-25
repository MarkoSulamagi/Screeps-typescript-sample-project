/// <reference path="../Castes/ICaste.ts" />
class CreepManager {
	constructor(public castes: ICaste[]) { }
	initializeRoom(roomName: string) {
		var roomMemory = Memory.rooms[roomName];
		roomMemory.creeps = {};
		this.castes.forEach(caste => roomMemory.creeps[caste.role] = []);
	}
	registerCreep(name: string) {
		var p0 = performance.now();
		Memory.creeps[name] = {role: CreepRole.none, status: CreepStatus.idle, route: null};
		console.log("registered creep " + name + ", time: " + (performance.now() - p0) + "ms");
	}
	applyBehavior(name: string, role: CreepRole) {
		var p0 = performance.now();
		var creep = Game.creeps[name];
		var behavior = _.find(this.castes, caste => caste.role == role);
		var roleCreeps = Memory.rooms[creep.room.name].creeps[creep.memory.role];
		behavior.applyBehavior(name);
		if (roleCreeps) roleCreeps.splice(roleCreeps.indexOf(name));
		var newRoleCreeps = Memory.rooms[creep.room.name].creeps[role];
		newRoleCreeps.push(name);
	}
	/**
	 * Checks input id list for creeps that have spawning status but are finished
	 * @param ids list of creep ids to check
	 * @returns returns the list of objects that are still spawning, not creeps, or that don't have a status of spawning
	 */
	main() {
		this.castes.forEach(behavior => {
			var roleNum: number = behavior.role;
			for (var roomName in Game.rooms) {
				var casteCreeps = Memory.rooms[roomName].creeps[roleNum];
				casteCreeps.forEach(creepName => {
					var creep = Game.creeps[creepName];
					if (!creep) {
						console.log(creepName + " no longer exits, removing from memory");
						behavior.disposeBehavior(roomName, creepName);
						casteCreeps.splice(casteCreeps.indexOf(creepName));
						return;
					}
					behavior.main(creepName);
				});
			}
		});
	}
}
interface CreepMemory {
	role: CreepRole;
	status: CreepStatus;
	route: SourceRoute;
}
enum CreepRole {
	none,
	harvester,
	combat,
	builder
}
enum CreepStatus {
	idle,
	building,
	returning,
	leaving,
	mining,
	attacking
}
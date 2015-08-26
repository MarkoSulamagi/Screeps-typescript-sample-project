/// <reference path="../Castes/ICaste.ts" />
class CreepManager {
	castes: {[role: number]: ICaste}
	constructor(castes: ICaste[]) {
		this.castes = {};
		castes.forEach(caste => {this.castes[caste.role] = caste});
		var casteMemory = Memory.castes;
		if (!casteMemory) casteMemory = {};
		for (var caste in this.castes) {
			if (castes.hasOwnProperty(caste)) {
				var element = this.castes[caste];
				
			}
		}(caste => Memory.castes[caste.role] = []);
	}
	registerCreep(name: string) {
		var p0 = performance.now();
		Memory.creeps[name] = { role: CreepRole.none, status: CreepStatus.idle, route: null };
		console.log("registered creep " + name + ", time: " + (performance.now() - p0) + "ms");
	}
	applyBehavior(name: string, role: CreepRole) {
		var p0 = performance.now();
		var creep = Game.creeps[name];
		var roleCreeps = Memory.castes[creep.memory.role];
		this.castes[role].applyBehavior(name);
		if (roleCreeps) roleCreeps.splice(roleCreeps.indexOf(name));
		Memory.castes[role].push(name);
	}
	/**
	 * Checks input id list for creeps that have spawning status but are finished
	 * @param ids list of creep ids to check
	 * @returns returns the list of objects that are still spawning, not creeps, or that don't have a status of spawning
	 */
	main() {
		for (var caste in Memory.castes) {
			Memory.castes[caste].forEach(creepName => {
				var creep = Game.creeps[creepName];
				if (!creep) {
					var memory = Memory.creeps[creepName];
					var casteCreeps = Memory.castes[memory.role];
					this.castes[memory.role].disposeBehavior(creepName);
					casteCreeps.splice(casteCreeps.indexOf(creepName));
					console.log(creepName + " no longer exits, removing from memory");
					return;
				}
				behavior.main(creepName);
			});
		}
	}
}
interface Memory {
	castes: { [role: number]: string[] };
}
/// <reference path="../Castes/ICaste.ts" />
class CasteManager {
	castes: { [role: number]: ICaste }
	constructor(castes: ICaste[]) {
		this.castes = {};
		castes.forEach(caste => { this.castes[caste.role] = caste });
		var casteMemory = Memory.castes;
		if (casteMemory == undefined) {
			Memory.castes = {}
			_.forOwn(this.castes, (caste: ICaste) => Memory.castes[caste.role] = { creeps: [], infants: [], popLimit: 0 });
		}
	}
	registerCreep(name: string) {
		var p0 = performance.now();
		Memory.creeps[name] = { role: CreepRole.none, status: CreepStatus.idle, route: null, _move: null, path: null, stuckTicks: 0, lastPos: null };
		console.log("registered creep " + name + ", time: " + (performance.now() - p0) + "ms");
	}
	applyBehavior(name: string, role: CreepRole) {
		var p0 = performance.now();
		var creep = Game.creeps[name];
		var roleCreeps = Memory.castes[creep.memory.role];
		this.castes[role].applyBehavior(name);
		if (roleCreeps != null) roleCreeps.creeps.splice(roleCreeps.creeps.indexOf(name));
		Memory.castes[role].creeps.push(name);
	}
	/**
	 * Checks input id list for creeps that have spawning status but are finished
	 * @param ids list of creep ids to check
	 * @returns returns the list of objects that are still spawning, not creeps, or that don't have a status of spawning
	 */
	main() {
		_.forOwn(this.castes, (caste: ICaste) => {
			var casteMemory = Memory.castes[caste.role];
			casteMemory.creeps.forEach(creepName => {
				var creep = Game.creeps[creepName];
				if (!creep) {
					var memory = Memory.creeps[creepName];
					var casteCreeps = Memory.castes[memory.role].creeps;
					this.castes[memory.role].disposeBehavior(creepName);
					_.remove(casteCreeps, name => name === creepName);
					console.log(creepName + " no longer exits, removing from memory");
					return;
				}
				if (creep.memory.lastPos === creep.pos.getId()) creep.memory.stuckTicks += 1;
				else creep.memory.stuckTicks = 0;
				caste.main(creepName);
				creep.memory.lastPos = creep.pos.getId();
			});
		});
	}
}
/// <reference path="_references.ts" />

class CreepManager {
	static memory(name: string): CreepMemory {
		return Game.creeps[name].memory
	}
	static registerCreep(name: string) {
		var memory = this.memory(name);
		memory.role = Role.none
		memory.status = Game.creeps[name].spawning ? Status.spawning : Status.idle;
	}
	/**
	 * Checks input id list for creeps that have spawning status but are finished
	 * @param ids list of creep ids to check
	 * @returns returns the list of objects that are still spawning, not creeps, or that don't have a status of spawning
	 */
	static UpdateSpawning(names: string[]) {
		var doneSpawning = names
			.map((name) => { return Game.creeps[name] })
			.filter((creep) => { return (creep && !creep.spawning && creep.memory.status === Status.spawning) ? true : false });
		doneSpawning.forEach((creep) => {
			creep.memory.status = Status.idle;
		});
		return _.difference(names, doneSpawning.map((creep) => { return creep.name; }))
	}
}
interface CreepMemory {
	role: Role;
	status: Status;
}
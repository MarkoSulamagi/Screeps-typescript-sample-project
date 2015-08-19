/// <reference path="_references.ts" />

class CreepManager {
	static memory(name: string): CreepMemory {
		return Game.creeps[name].memory
	}
	static registerCreep(name: string) {
		var memory = this.memory(name);
		memory.role = Role.none
		memory.status = CreepStatus.idle;
	}
	/**
	 * Checks input id list for creeps that have spawning status but are finished
	 * @param ids list of creep ids to check
	 * @returns returns the list of objects that are still spawning, not creeps, or that don't have a status of spawning
	 */
	static main(names: string[]) {
		names.forEach(name => {
			var memory = this.memory(name);
			if (!memory) return;
			if (!memory.role) {
				this.registerCreep(name);
			}
		});
	}
}
interface CreepMemory {
	role: Role;
	status: CreepStatus;
}
enum CreepStatus {
	idle,
	returning,
	leaving,
	mining
}
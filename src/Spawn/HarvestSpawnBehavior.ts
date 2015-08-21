/// <reference path="../_references.ts" />
/// <reference path="../Creep/CreepRole.ts" />
/// <reference path="../Creep/CreepManager.ts" />
/// <reference path="ISpawnBehavior.ts" />
/// <reference path="../RoomManager.ts" />



class HarvestSpawnBehavior implements ISpawnBehavior {
	role: CreepRole;
	weight: number
	constructor(private creepManager: CreepManager) {
		this.role = CreepRole.harvester;
	}
	getWeight(roomName: string) {
		var global = RoomManager.memory(roomName).role[this.role];
		if((global.creeps.length + global.infants.length) == 0) return .6;
		return .6 - (global.creeps.length + global.infants.length) / global.capacity;
	}
	main(name: string) {
		var spawn = Game.spawns[name];
		var room = spawn.room.name;
		var global = RoomManager.memory(room).role[this.role];
		global.infants.forEach(infant => {
			var creep = Game.creeps[infant];
			if (!creep || creep.spawning) return;
			global.infants.splice(global.infants.indexOf(infant));
			console.log(infant + " is all grown up");
			this.creepManager.registerCreep(infant);
			this.creepManager.applyBehavior(infant, CreepRole.harvester);
			global.infants.splice(global.infants.indexOf(infant));
		});
		if ((global.creeps.length + global.infants.length) < global.capacity) {
			var p0 = performance.now();
			var result = spawn.createCreep(["carry", "work", "move"]);
			if (_.isString(result)) {
				var creepName: string = result.toString();
				global.infants.push(creepName);
				console.log("spawning new creep " + creepName + ", time: " + (performance.now() - p0) + "ms");
				console.log("harvester pop in " + room + " at " + (global.creeps.length + global.infants.length) + " out of " + global.capacity);
				return ResultCode.OK;
			}
			var errorCode: ResultCode = +result;
			return errorCode;
		}
		return ResultCode.OK;
	}
}
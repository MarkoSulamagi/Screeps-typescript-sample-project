/// <reference path="../_references.ts" />
/// <reference path="SpawnBehaviorMemory.ts" />

/// <reference path="../Creep/CreepRole.ts" />
/// <reference path="../Creep/CreepManager.ts" />
/// <reference path="ISpawnBehavior.ts" />
/// <reference path="../RoomManager.ts" />



class HarvestSpawnBehavior implements ISpawnBehavior {
	role: CreepRole;
	private memory: SpawnBehaviorMemory;
	weight: number
	constructor(private creepManager: CreepManager) {
		this.role = CreepRole.harvester;
		if (!Memory.harvestSpawnBehavior) {
			Memory.harvestSpawnBehavior = { room: {}, roomCapacity: {} };
		}
		this.memory = Memory.harvestSpawnBehavior;
	}
	getWeight(roomName: string) {
		if(this.memory.room[roomName].length < 1) return .6;
		return .6 - this.memory.room[roomName].length / this.memory.roomCapacity[roomName]
	}
	main(name: string) {
		var spawn = Game.spawns[name];
		var room = spawn.room.name;
		if (!this.memory.room[room].length) {
			this.memory.room[room] = [];
		}
		if (!_.isNumber(this.memory.roomCapacity[room])) {
			this.memory.roomCapacity[room] = this.getHarvestSpots(room);
		}
		if (this.memory.room[room].length < this.memory.roomCapacity[room]) {
			var result = spawn.createCreep(["carry", "work", "move"]);
			if (_.isString(result)) {
				var creepName: string = result.toString();
				this.creepManager.registerCreep(creepName);
				this.creepManager.applyBehavior(creepName, this.role);
				return ResultCode.OK;
			}
			var errorCode: ResultCode = +result;
			return errorCode;
		}
	}
	getHarvestSpots(roomName: string) {
		var availableSourcePaths = _.filter(RoomManager.memory(roomName).harvestRoutes, route => {
			return route.creepName == null;
		}).length;
		return availableSourcePaths;
	}
}
/// <reference path="_references.ts" />
/// <reference path="CreepManager.ts" />
/// <reference path="SourceRoute.ts" />
/// <reference path="RoomManager.ts" />


class HarvestCreepManager extends CreepManager {
	static registerCreep(name: string): number {
		var creep = Game.creeps[name];
		if (!creep) { return Result.ERR_INVALID_TARGET; }
		var memory = CreepManager.memory(name);
		if (memory.status != CreepStatus.idle) { return Result.ERR_BUSY; }
		memory.role = CreepRole.harvester;
		var room = RoomManager.memory(creep.room.name);
		var route = _.find(room.harvestRoutes, iroute => {
			return iroute.creepName == null;
		});
		if (route) {
			memory.route = route;
		} else {
			memory.route = null;
		}
		return Result.OK;
	}
	static getIdleHarvesters(names: string[]) {
		return names.filter((name) => {
			var memory = CreepManager.memory(name)
			return memory.role === CreepRole.harvester && memory.status === CreepStatus.idle
		});
	}
	static main(names: string[]) {
		super.main(names);
		names.forEach(name => {
			var memory = CreepManager.memory(name);
			if (!memory) return;
			if (memory.role == CreepRole.none) {
				console.log("registering harvest creep " + name);
				var result = HarvestCreepManager.registerCreep(name);
				if (result != Result.OK) {
					console.log("failed to register " + name + "as harvester, error code: " + result);
				}
			}
			var creep = Game.creeps[name];
			if (creep.spawning) return;
			if (memory.status == CreepStatus.idle && memory.route) {
				memory.status = CreepStatus.leaving;
			}
			if (memory.status == CreepStatus.leaving &&
				creep.pos.isEqualTo(
					creep.room.getPositionAt(
						memory.route.harvestPos.x,
						memory.route.harvestPos.y))) {
			memory.status = CreepStatus.mining;
		}
		if (memory.status == CreepStatus.leaving) {
			var result = creep.moveByPath(memory.route.toSource)
			if (result == Result.ERR_NOT_FOUND) {
				console.log(creep.name + " is not on path and is moving expensively, error code: " + result);
				creep.moveTo(creep.room.getPositionAt(
						memory.route.harvestPos.x,
						memory.route.harvestPos.y));
			}
		}
		if (memory.status == CreepStatus.mining && creep.carry.energy >= creep.carryCapacity) {
			memory.status = CreepStatus.returning;
		}
		if (memory.status == CreepStatus.mining) {
			creep.harvest(Game.getObjectById<Source>(memory.route.sourceId));
		}
		if (memory.status == CreepStatus.returning && creep.pos.isNearTo(Game.spawns[memory.route.spawnName].pos)) {
			var result = creep.transferEnergy(Game.spawns[memory.route.spawnName]);
			if (result == Result.OK) { memory.status = CreepStatus.leaving }
		}
		if (memory.status == CreepStatus.returning) {
			var result = creep.moveByPath(memory.route.toSpawn)
			if (result == Result.ERR_NOT_FOUND) {
				console.log(creep.name + " is not on path and is moving expensively, error code: " + result);
				creep.moveTo(creep.room.getPositionAt(
						memory.route.toSpawn[0].x,
						memory.route.toSpawn[0].y));
			}
		}
	});
}
}
interface CreepMemory {
	route: SourceRoute
}
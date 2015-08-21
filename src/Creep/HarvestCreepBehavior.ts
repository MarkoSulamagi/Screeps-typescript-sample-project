/// <reference path="../_references.ts" />
/// <reference path="CreepStatus.ts" />
/// <reference path="CreepRole.ts" />
/// <reference path="ICreepBehavior.ts" />
/// <reference path="CreepManager.ts" />
/// <reference path="../SourceRoute.ts" />
/// <reference path="../RoomManager.ts" />


class HarvestCreepBehavior implements ICreepBehavior {
	role: CreepRole;
	constructor() {
		this.role = CreepRole.harvester;
	}
	private memory(name: string) {
		return Game.creeps[name].memory;
	}
	applyBehavior(name: string) {
		var creep = Game.creeps[name];
		if (!creep) return ResultCode.ERR_INVALID_ARGS;
		if (creep.spawning) return ResultCode.ERR_BUSY;
		var room = RoomManager.memory(creep.room.name);
		console.log(room);
		var harvestRoutes = _.flatten(room.sources.map(source => SourceManager.memory(source).harvestRoutes));
		var route = _.find(harvestRoutes, r => {
			return r.creepName == null;
		});
		if (!route) return ResultCode.ERR_NO_PATH;
		var memory = CreepManager.memory(name);
		memory.role = CreepRole.harvester;
		memory.route = route;
		route.creepName = name;
		return ResultCode.OK;
	}
	main(name: string) {
		var memory = CreepManager.memory(name);
		var creep = Game.creeps[name];
		if (memory.status == CreepStatus.idle && memory.route) {
			memory.status = CreepStatus.leaving;
		}
		if (!memory.route){
			console.log(name + " has no route!");
		}
		if (memory.status == CreepStatus.leaving &&
			creep.pos.isEqualTo(
				creep.room.getPositionAt(
					memory.route.harvestPos.x,
					memory.route.harvestPos.y))) {
			memory.status = CreepStatus.mining;
		}
		if (memory.status == CreepStatus.leaving) {
			var p0 = performance.now();
			var result = creep.moveByPath(memory.route.toSource)
			if (result == ResultCode.ERR_NOT_FOUND) {
				var direction = creep.pos.getDirectionTo(creep.room.getPositionAt(
					memory.route.toSource[0].x,
					memory.route.toSource[0].y));
				var manualMoveResult = creep.move(direction);
				console.log(creep.name + " is moving " + direction + " towards path, error code: " + result + ", time: " + (performance.now() - p0) + "ms");
				return manualMoveResult;
			}
			return result;
		}
		if (memory.status == CreepStatus.mining && creep.carry.energy >= creep.carryCapacity) {
			memory.status = CreepStatus.returning;
		}
		if (memory.status == CreepStatus.mining) {
			return creep.harvest(Game.getObjectById<Source>(memory.route.sourceId));
		}
		if (memory.status == CreepStatus.returning && creep.pos.isNearTo(Game.spawns[memory.route.spawnName].pos)) {
			var result = creep.transferEnergy(Game.spawns[memory.route.spawnName]);
			if (result == ResultCode.OK) { memory.status = CreepStatus.leaving }
			return result;
		}
		if (memory.status == CreepStatus.returning) {
			var result = creep.moveByPath(memory.route.toSpawn)
			if (result == ResultCode.ERR_NOT_FOUND) {
				var p0 = performance.now();
				var manualMoveResult = creep.moveTo(creep.room.getPositionAt(
					memory.route.toSpawn[0].x,
					memory.route.toSpawn[0].y));
				console.log(creep.name + " is moving to path, error code: " + result + ", time: " + (performance.now() - p0) + "ms");
				return manualMoveResult;
			}
			return result;
		}
		console.log(name + " is in a broken state");
	}
}
interface CreepMemory {
	route: SourceRoute
}
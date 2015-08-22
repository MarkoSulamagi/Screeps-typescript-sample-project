/// <reference path="../_references.ts" />
/// <reference path="../Managers/CreepManager.ts" />
/// <reference path="../Managers/RoomManager.ts" />

/// <reference path="ICaste.ts" />

class HarvestCaste implements ICaste {
	role = CreepRole.harvester;
	minimumCost = 200;
	baseWeight = 1;
	getBlueprint(energy: number) {
		if (energy < 200) return null;
		var blueprint = ["move", "carry", "work"];
		energy = energy - 200;
		while(energy >= 50) {
			if (energy > 50) {
				blueprint.push("move");
				energy = energy - 50;
			}
			if (energy > 50) {
				blueprint.push("carry");
				energy = energy - 50;
			}
			if (energy > 100) {
				blueprint.push("work");
				energy = energy - 100
			}
		}
		return blueprint;
	}
	applyBehavior(name: string) {
		var creep = Game.creeps[name];
		if (!creep) return ResultCode.ERR_INVALID_ARGS;
		if (creep.spawning) return ResultCode.ERR_BUSY;
		var roomMemory = Memory.rooms[creep.room.name];
		var harvestRoutes = _.flatten(roomMemory.sources.map(source => Memory.sources[source].harvestRoutes));
		var route = _.find(harvestRoutes, r => {
			return r.creepName == null;
		});
		if (!route) return ResultCode.ERR_NO_PATH;
		var creepMemory = Memory.creeps[name];
		creepMemory.role = CreepRole.harvester;
		creepMemory.route = route;
		route.creepName = name;
		console.log("applied harvester behavior to " + name);
		return ResultCode.OK;
	}
	disposeBehavior(roomName: string, name: string) {
		var room = RoomManager.memory(roomName);
		var harvestRoutes = _.flatten(room.sources.map(source => SourceManager.memory(source).harvestRoutes));
		var route = _.find(harvestRoutes, r => {
			return r.creepName == name;
		});
		if (route) route.creepName = null;
		console.log("removed harvester behavior from " + name);
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
				var manualMoveResult = creep.moveTo(creep.room.getPositionAt(
					memory.route.toSource[0].x,
					memory.route.toSource[0].y));
				console.log(creep.name + " is moving towards path, error code: " + result + ", time: " + (performance.now() - p0) + "ms");
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
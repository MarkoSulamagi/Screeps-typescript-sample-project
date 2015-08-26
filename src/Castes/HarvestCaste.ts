/// <reference path="../_references.ts" />
/// <reference path="../Managers/CreepManager.ts" />
/// <reference path="../Managers/RoomManager.ts" />
/// <reference path="ICaste.ts" />

class HarvestCaste implements ICaste {
	role: CreepRole;
	minimumCost: number;
	baseWeight: number;
	constructor() {
		this.role = CreepRole.harvester;
		this.minimumCost = 200;
		this.baseWeight = 1;
	}
	getBlueprint(energy: number) {
		if (energy < 200) return null;
		var blueprint = [MOVE, CARRY, WORK];
		energy = energy - 200;
		while(energy >= 50) {
			if (energy >= 50) {
				blueprint.push(MOVE);
				energy = energy - 50;
			}
			if (energy >= 50) {
				blueprint.push(CARRY);
				energy = energy - 50;
			}
			if (energy >= 100) {
				blueprint.push(WORK);
				energy = energy - 100
			}
		}
		return blueprint;
	}
	applyBehavior(name: string) {
		var creep = Game.creeps[name];
		if (!creep) return ERR_INVALID_ARGS;
		if (creep.spawning) return ERR_BUSY;
		var roomMemory = Memory.rooms[creep.room.name];
		var harvestRoutes = _.flatten(roomMemory.sources.map(source => Memory.sources[source].harvestRoutes));
		var route = _.find(harvestRoutes, r => {
			return r.creepName == null;
		});
		if (!route) return ERR_NO_PATH;
		var creepMemory = Memory.creeps[name];
		creepMemory.role = CreepRole.harvester;
		creepMemory.route = route;
		route.creepName = name;
		console.log("applied harvester behavior to " + name);
		return OK;
	}
	disposeBehavior(name: string) {
		var roomMemory = Memory.rooms[roomName];
		var harvestRoutes = _.flatten(roomMemory.sources.map(source => Memory.sources[source].harvestRoutes));
		var route = _.find(harvestRoutes, r => {
			return r.creepName == name;
		});
		if (route) route.creepName = null;
		console.log("removed harvester behavior from " + name);
		return OK;
	}
	main(name: string) {
		var creepMemory = Memory.creeps[name];
		var creep = Game.creeps[name];
		if (creepMemory.status == CreepStatus.idle && creepMemory.route) {
			creepMemory.status = CreepStatus.leaving;
		}
		if (!creepMemory.route){
			console.log(name + " has no route!");
		}
		if (creepMemory.status == CreepStatus.leaving &&
			creep.pos.isEqualTo(
				creep.room.getPositionAt(
					creepMemory.route.harvestPos.x,
					creepMemory.route.harvestPos.y))) {
			creepMemory.status = CreepStatus.mining;
		}
		if (creepMemory.status == CreepStatus.leaving) {
			var p0 = performance.now();
			var result = creep.moveByPath(creepMemory.route.toSource)
			if (result == ERR_NOT_FOUND) {
				var manualMoveResult = creep.moveTo(creep.room.getPositionAt(
					creepMemory.route.toSource[0].x,
					creepMemory.route.toSource[0].y));
				console.log(creep.name + " is moving towards path, error code: " + result + ", time: " + (performance.now() - p0) + "ms");
				return manualMoveResult;
			}
			return result;
		}
		if (creepMemory.status == CreepStatus.mining && creep.carry.energy >= creep.carryCapacity) {
			creepMemory.status = CreepStatus.returning;
		}
		if (creepMemory.status == CreepStatus.mining) {
			return creep.harvest(Game.getObjectById<Source>(creepMemory.route.sourceId));
		}
		if (creepMemory.status == CreepStatus.returning && creep.pos.isNearTo(Game.spawns[creepMemory.route.spawnName].pos)) {
			var result = creep.transferEnergy(Game.spawns[creepMemory.route.spawnName]);
			if (result == OK) { creepMemory.status = CreepStatus.leaving }
			return result;
		}
		if (creepMemory.status == CreepStatus.returning) {
			var result = creep.moveByPath(creepMemory.route.toSpawn)
			if (result == ERR_NOT_FOUND) {
				var p0 = performance.now();
				var manualMoveResult = creep.moveTo(creep.room.getPositionAt(
					creepMemory.route.toSpawn[0].x,
					creepMemory.route.toSpawn[0].y));
				console.log(creep.name + " is moving to path, error code: " + result + ", time: " + (performance.now() - p0) + "ms");
				return manualMoveResult;
			}
			return result;
		}
		console.log(name + " is in a broken state");
		return OK;
	}
}
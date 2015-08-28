/// <reference path="../_references.ts" />
/// <reference path="../Managers/CasteManager.ts" />
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
		if (Memory.harvest == undefined) Memory.harvest = {};
	}
	getBlueprint(energy: number) {
		if (energy < 200) return null;
		var blueprint = [MOVE, CARRY, WORK];
		energy = energy - 200;
		while (energy >= 50) {
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
		var sourceMemory = Memory.sources;
		var miningNodes = _.flatten<MiningNode>(_.values<SourceMemory>(sourceMemory).filter(source => !source.forbidden).map(source => source.miningNodes));
		var route = _.find(miningNodes, r => {
			return r.creepName == null;
		});
		if (!route) return ERR_NO_PATH;
		var creepMemory = Memory.creeps[name];
		creepMemory.role = CreepRole.harvester;
		Memory.harvest[name] = { miningNode: route, dropOff: creep.pos.findClosest<Structure>(FIND_MY_SPAWNS).id };
		route.creepName = name;
		console.log("applied harvester behavior to " + name);
		return OK;
	}
	disposeBehavior(name: string) {
		var sourceMemory = Memory.sources;
		var miningNodes = _.flatten<MiningNode>(_.values<SourceMemory>(sourceMemory).map(source => source.miningNodes));
		var route = _.find(miningNodes, r => {
			return r.creepName == name;
		});
		if (route != null) route.creepName = null;
		console.log("removed harvester behavior from " + name);
		return OK;
	}
	main(name: string) {
		var creepMemory = Memory.creeps[name];
		var creep = Game.creeps[name];
		var harvestMemory = Memory.harvest[name];
		if (harvestMemory == null) console.log("YA DONE FUCKED UP SON");
		if (harvestMemory.miningNode == null) console.log("WHY THE FUCK IS THERE NO NODE?");
		if (creepMemory.status == CreepStatus.idle && harvestMemory.miningNode) {
			creepMemory.status = CreepStatus.leaving;
		}
		if (harvestMemory.miningNode == null) {
			console.log(name + " has no route!");
		}
		if (creepMemory.status == CreepStatus.leaving &&
			creep.pos.isEqualTo(RoomPosition.fromId(harvestMemory.miningNode.posId))) {
			creepMemory.status = CreepStatus.mining;
		}
		if ((creepMemory.status == CreepStatus.leaving || creepMemory.status == CreepStatus.returning) && creepMemory.stuckTicks > 10) {
			if (creepMemory.path != null) {
				delete Memory.paths[creepMemory.path];
				creepMemory.path = null;
				console.log("trying to get " + name + " unstuck");
			}
		}
		if (creepMemory.status == CreepStatus.leaving) {
			if (creepMemory.path == null) {
				creepMemory.path = creep.pos.generatePathTo(RoomPosition.fromId(harvestMemory.miningNode.posId)).id;
			}
			var result = creep.fastMoveByPath(creepMemory.path);
			if (result === ERR_NO_PATH || result === ERR_NOT_FOUND) {
				console.log(name + " has an incorrect path");
				creepMemory.path = null;
			}
			if (result === ERR_TIRED) {
				creepMemory.stuckTicks = 0;
			}
			return result;
		}
		if (creepMemory.status == CreepStatus.mining && creep.carry.energy >= creep.carryCapacity) {
			creepMemory.status = CreepStatus.returning;
			creepMemory.stuckTicks = 0;
		}
		if (creepMemory.status == CreepStatus.mining) {
			return creep.harvest(Game.getObjectById<Source>(harvestMemory.miningNode.sourceId));
		}
		if (creepMemory.status == CreepStatus.returning && harvestMemory.dropOff == null) {
			harvestMemory.dropOff = creep.pos.findClosest<Structure>(FIND_MY_SPAWNS).id;
		}
		if (creepMemory.status == CreepStatus.returning && creep.pos.isNearTo(Game.getObjectById<Structure>(harvestMemory.dropOff).pos)) {
			var result = creep.transferEnergy(Game.getObjectById<Structure>(harvestMemory.dropOff));
			if (result == OK) {
				creepMemory.status = CreepStatus.leaving;
				creepMemory.path = null;
			}
			return result;
		}
		if (creepMemory.status == CreepStatus.returning) {
			if (creepMemory.path == null) {
				creepMemory.path = creep.pos.generatePathTo(Game.getObjectById<Structure>(harvestMemory.dropOff).pos).id;
			}
			var result = creep.fastMoveByPath(creepMemory.path);
			if (result === ERR_NO_PATH) {
				console.log(name + " has an incorrect path");
				creepMemory.path = null;
			}
			if (result === ERR_TIRED) {
				creepMemory.stuckTicks = 0;
			}
			return result;
		}
		console.log(name + " is in a broken state");
		return OK;
	}
}
interface Memory {
	harvest: { [name: string]: HarvestMemory }
}
interface HarvestMemory {
	miningNode: MiningNode;
	dropOff: string;
}
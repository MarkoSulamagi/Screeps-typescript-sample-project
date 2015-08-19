/// <reference path="_references.ts" />

class HarvestCreepManager {
	static registerHarvestCreep(name: string) {
		CreepManager.registerCreep(name);
		var creep = Game.creeps[name];
		if (!creep) { return Result.ERR_INVALID_TARGET; }
		var memory = CreepManager.memory(name);
		if (memory.status != Status.idle) { return Result.ERR_BUSY; }
		memory.role = Role.harvester;
		memory.harvester = { sourceId: null, toSource: null, spawnName: null, toSpawn: null, status: HarvestCreepStatus.idle };
		return Result.OK;
	}
	static getIdleHarvesters(names: string[]) {
		return names.filter((name) => {
			var memory = CreepManager.memory(name)
			return memory.role === Role.harvester && memory.status === Status.idle
		});
	}
	private static AssignToClosest(name: string) {
		var creep = Game.creeps[name];
		var source = creep.pos.findClosest<Source>(FindCode.FIND_SOURCES);
		var memory = CreepManager.memory(name);
		memory.harvester.sourceId = source.id;
		var spawn = source.pos.findClosest<Spawn>(FindCode.FIND_MY_SPAWNS);
		memory.harvester.spawnName = spawn.name;
	}
	static main(names: string[]) {
		names.forEach(name => {
			var memory = CreepManager.memory(name);
			var creep = Game.creeps[name];
			if (memory.harvester.status == HarvestCreepStatus.idle) {
				memory.harvester.status = HarvestCreepStatus.leaving;
			}
			if (memory.harvester.status == HarvestCreepStatus.leaving && creep.pos.isNearTo(Game.getObjectById<Source>(memory.harvester.sourceId).pos)) {
				memory.harvester.status = HarvestCreepStatus.mining;
			}
			if (memory.harvester.status == HarvestCreepStatus.leaving) {
				var result = creep.moveByPath(memory.harvester.toSource)
				if (result == Result.ERR_NOT_FOUND || result == Result.ERR_INVALID_ARGS) {
					if (memory.harvester.toSource) { console.log(creep.name + " has a bad path to source") }
					memory.harvester.toSource = creep.pos.findPathTo(Game.getObjectById<Source>(memory.harvester.sourceId));
				}
			}
			if (memory.harvester.status == HarvestCreepStatus.mining && creep.carry.energy >= creep.carryCapacity) {
				if (!memory.harvester.toSpawn) {
					memory.harvester.toSpawn = creep.pos.findPathTo(Game.spawns[memory.harvester.spawnName]);
				}
				memory.harvester.status = HarvestCreepStatus.returning;
			}
			if (memory.harvester.status == HarvestCreepStatus.mining) {
				creep.harvest(Game.getObjectById<Source>(memory.harvester.sourceId));
			}
			if (memory.harvester.status == HarvestCreepStatus.returning && creep.pos.isNearTo(Game.getObjectById<Spawn>(memory.harvester.sourceId).pos)) {
				var result = creep.transferEnergy(Game.spawns[memory.harvester.spawnName]);
				if (result == Result.OK) {memory.harvester.status = HarvestCreepStatus.leaving}
			}
			if (memory.harvester.status == HarvestCreepStatus.returning) {
				var result = creep.moveByPath(memory.harvester.toSpawn)
				if (result == Result.ERR_NOT_FOUND || result == Result.ERR_INVALID_ARGS) {
					if (memory.harvester.toSpawn) { console.log(creep.name + " has a bad path to spawn") }
					memory.harvester.toSpawn = creep.pos.findPathTo(Game.spawns[memory.harvester.spawnName]);
				}
			}
		});
	}
}
interface CreepMemory {
	harvester: HarvestCreepMemory
}
interface HarvestCreepMemory {
	sourceId: string;
	toSource: PathStep[];
	spawnName: string;
	toSpawn: PathStep[];
	status: HarvestCreepStatus;
}
enum HarvestCreepStatus {
	idle,
	returning,
	leaving,
	mining
}
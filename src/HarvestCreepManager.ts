/// <reference path="_references.ts" />
/// <reference path="CreepManager.ts" />

class HarvestCreepManager extends CreepManager {
	static registerCreep(name: string): number {
		var creep = Game.creeps[name];
		if (!creep) { return Result.ERR_INVALID_TARGET; }
		var memory = CreepManager.memory(name);
		if (memory.status != CreepStatus.idle) { return Result.ERR_BUSY; }
		memory.role = CreepRole.harvester;
		memory.harvester = { sourceId: null, toSource: null, spawnName: null, toSpawn: null };
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
			if (memory.status == CreepStatus.idle) {
				var source = creep.pos.findClosest<Source>(FindCode.FIND_SOURCES);
				var memory = CreepManager.memory(name);
				memory.harvester.sourceId = source.id;
				var spawn = source.pos.findClosest<Spawn>(FindCode.FIND_MY_SPAWNS);
				memory.harvester.spawnName = spawn.name;
				memory.status = CreepStatus.leaving;
			}
			if (memory.status == CreepStatus.leaving && creep.pos.isNearTo(Game.getObjectById<Source>(memory.harvester.sourceId).pos)) {
				memory.status = CreepStatus.mining;
			}
			if (memory.status == CreepStatus.leaving) {
				var result = creep.moveByPath(memory.harvester.toSource)
				if (result == Result.ERR_NOT_FOUND || result == Result.ERR_INVALID_ARGS) {
					if (memory.harvester.toSource) { console.log(creep.name + " has a bad path to source") }
					memory.harvester.toSource = creep.pos.findPathTo(Game.getObjectById<Source>(memory.harvester.sourceId));
				}
			}
			if (memory.status == CreepStatus.mining && creep.carry.energy >= creep.carryCapacity) {
				if (!memory.harvester.toSpawn) {
					memory.harvester.toSpawn = creep.pos.findPathTo(Game.spawns[memory.harvester.spawnName]);
				}
				memory.status = CreepStatus.returning;
			}
			if (memory.status == CreepStatus.mining) {
				creep.harvest(Game.getObjectById<Source>(memory.harvester.sourceId));
			}
			if (memory.status == CreepStatus.returning && creep.pos.isNearTo(Game.getObjectById<Spawn>(memory.harvester.sourceId).pos)) {
				var result = creep.transferEnergy(Game.spawns[memory.harvester.spawnName]);
				if (result == Result.OK) { memory.status = CreepStatus.leaving }
			}
			if (memory.status == CreepStatus.returning) {
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
}
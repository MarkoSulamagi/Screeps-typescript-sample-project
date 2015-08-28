/// <reference path="screeps.d.ts" />
interface Creep {
	fastMoveByPath(pathId: string): number;
	getCasteMemory<TMemory>(): TMemory;
}
Creep.prototype.fastMoveByPath = function(pathId: string) {
	var _this: Creep = this;
	var path = Memory.paths[_this.memory.path];
	if (path == null) return ERR_NO_PATH;
	if (path.lastUsed === Game.time) path.usagePerTick += 1;
	else {
		path.lastUsed = Game.time;
		path.usagePerTick = 1;
	}
	return _this.moveByPath(path.steps);
}
Creep.prototype.getCasteMemory = function() {
	var _this: Creep = this;
	if (Memory.casteMemory == undefined) Memory.casteMemory = {}
	return Memory.casteMemory[_this.memory.role][_this.name];
}
interface Memory {
	casteMemory: {[role: number]: {[name: string]: any}}
}
interface CreepMemory {
	role: CreepRole;
	status: CreepStatus;
	lastPos: string;
	stuckTicks: number;
	_move: PathStep[];
	path: string;
}
enum CreepRole {
	none,
	harvester,
	combat,
	builder
}
enum CreepStatus {
	idle,
	building,
	returning,
	leaving,
	mining,
	attacking
}
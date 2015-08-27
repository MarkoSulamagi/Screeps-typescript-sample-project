/// <reference path="screeps.d.ts" />
interface Creep {
	fastMoveByPath(pathId: string): number;
}
Creep.prototype.fastMoveByPath = function(pathId: string) {
	var _this: Creep = this;
	var path = Memory.paths[_this.memory.path];
	if (!path) return ERR_NO_PATH;
	if (path.lastUsed === Game.time) path.usagePerTick += 1;
	else {
		path.lastUsed = Game.time;
		path.usagePerTick = 1;
	}
	return _this.moveByPath(path.steps);
}
interface CreepMemory {
	role: CreepRole;
	status: CreepStatus;
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
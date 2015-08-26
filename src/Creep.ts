/// <reference path="_references.ts" />
interface CreepMemory {
	role: CreepRole;
	status: CreepStatus;
	_move: PathStep[];
	path: PathStep[];
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
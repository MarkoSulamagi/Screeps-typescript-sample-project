/// <reference path="CreepRole.ts" />
/// <reference path="../ResultCode.ts" />

interface ICreepBehavior {
	role: CreepRole;
	main(name: string): ResultCode;
	applyBehavior(name: string): ResultCode;
}
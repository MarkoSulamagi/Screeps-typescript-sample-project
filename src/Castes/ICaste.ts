/// <reference path="../ResultCode.ts" />
interface ICaste {
	role: CreepRole;
	baseWeight: number;
	getBlueprint(energy: number): string[];
	minimumCost: number;
	main(name: string): ResultCode;
	applyBehavior(name: string): ResultCode;
	disposeBehavior(room: string, name: string): ResultCode;
}
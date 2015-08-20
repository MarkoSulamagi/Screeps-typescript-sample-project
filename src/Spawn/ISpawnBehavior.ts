/// <reference path="../ResultCode.ts" />
/// <reference path="SpawnBehaviorMemory.ts" />


interface ISpawnBehavior {
	role: CreepRole;
	main(name: string): ResultCode;
	getWeight(roomName: string): number;
}
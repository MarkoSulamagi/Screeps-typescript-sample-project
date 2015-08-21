/// <reference path="../ResultCode.ts" />
interface ISpawnBehavior {
	role: CreepRole;
	main(name: string): ResultCode;
	getWeight(roomName: string): number;
}
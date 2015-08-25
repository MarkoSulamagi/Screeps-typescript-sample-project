/// <reference path="RoomManager.ts" />
class StructureManager {
	constructor() {}
	initializeRoom(roomName: string) {
		var roomMemory = Memory.rooms[roomName];
		roomMemory.structures = {};
		for (var type in CONSTRUCTION_COST) {
			roomMemory.structures[type] = [];
		}
	}
	registerStructure(id: string) {
		var structure = Game.getObjectById<Structure>(id);
		Memory.rooms[structure.room.name].structures[structure.structureType].push(id);
	}
	main() {
		for (var roomName in Memory.rooms) {
			var room = Game.rooms[roomName];
			var roomMemory = room.memory;
			
		}
	}
}
/// <reference path="../_references.ts" />
/// <reference path="RoomManager.ts" />
/// <reference path="../Castes/ICaste.ts" />


class DefenceManager {
	constructor(private roomManager: RoomManager, private casteManager: CasteManager) {}
	registerDefence(roomName: string) {
		var roomMemory = Memory.rooms[roomName];
		roomMemory.hostiles = [];
	}
	main() {
		
	}
}
interface DefenceMemory {
	name: string;
	counters: ICaste[];
	assignedDefenders: string[];
}
interface DefenceManagerMemory {
	roomsUnderAttack: string[];
}
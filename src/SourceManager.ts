/// <reference path="_references.ts" />
class SourceManager {
	static memory(id: string): SourceMemory {
		return Memory.source[id];
	}
	static registerSources(roomName: string) {
		var room = Game.rooms[roomName];
		if (!room) return;
		var sources = room.find<Source>(FindCode.FIND_SOURCES)
	}
}
interface SourceMemory {
	
}
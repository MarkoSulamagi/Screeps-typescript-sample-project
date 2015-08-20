/// <reference path="_references.ts" />
/// <reference path="RoomManager.ts" />

class SimulationGame {
	static main() {
		var roomNames = _.keys(Game.rooms);
		RoomManager.main(roomNames);
	}
}
/// <reference path="RoomManager.ts" />

class SourceManager {
	constructor() {
		if (Memory.sources === undefined) {
			Memory.sources = {};
		}
	}
	registerSource(id: string) {
		Memory.sources[id] = { miningNodes: [], isPlotted: false, forbidden: false };
		var source = Game.getObjectById<Source>(id);
		Memory.sources[id].miningNodes = source.getHarvestSpots().map(pos => { return { sourceId: source.id, posId: pos.getId(), creepName: null } });
		Memory.castes[CreepRole.harvester].popLimit += Memory.sources[id].miningNodes.length;
		console.log("registered source " + source.id);
	}
	main() {
	}
}
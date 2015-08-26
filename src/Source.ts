/// <reference path="screeps.d.ts" />
interface Source {
	getMemory(): SourceMemory;
	getHarvestSpots(): RoomPosition[];
}
Source.prototype.getMemory = function() {
	var _this:Source = this;
	return Memory.sources[_this.id];
}
Source.prototype.getHarvestSpots = function() {
	var _this: Source = this;
	return _this.pos.findPathableAround();
}
interface Memory {
	sources: {[id: string]: SourceMemory}
}
interface SourceMemory {
	harvestRoutes: SourceRoute[];
	isPlotted: boolean;
	forbidden: boolean;
}
interface SourceRoute {
	sourceId: string;
	spawnName: string;
	creepName: string;
	needsUpdate: boolean;
	toSource: PathStep[];
	toSpawn: PathStep[];
}
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
	miningNodes: MiningNode[];
	isPlotted: boolean;
	forbidden: boolean;
}
interface MiningNode {
	sourceId: string;
	posId: string;
	creepName: string;
}
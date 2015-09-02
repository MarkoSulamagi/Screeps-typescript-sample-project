/// <reference path="SourceManager.ts" />

class RoadManager {
	constructor() {
		if (Memory.roads == null) Memory.roads = {};
	}
	buildRoad(path: Path) {
		var roadMemory: string[] = [];
		path.steps.forEach(step => {
			path.
		})
	}
	main() {
		
	}
}
interface Memory {
	roads: {[id: string]: RoadMemory}
}
interface RoadMemory {
	roads: string[];
}
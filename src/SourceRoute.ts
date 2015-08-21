/// <reference path="_references.ts" />

interface SourceRoute {
	sourceId: string;
	spawnName: string;
	creepName: string;
	needsUpdate: boolean;
	harvestPos: { x: number, y: number }
	toSource: PathStep[];
	toSpawn: PathStep[];
}
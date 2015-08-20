/// <reference path="_references.ts" />

interface SourceRoute {
	sourceId: string;
	spawnName: string;
	creepName: string;
	harvestPos: { x: number, y: number }
	toSource: PathStep[];
	toSpawn: PathStep[];
}
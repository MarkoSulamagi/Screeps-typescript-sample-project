/// <reference path="_references.ts" />
class SourceManager {
	constructor() {
		if (!Memory.source) {
			Memory.source = {};
		}
	}
	static memory(id: string): SourceMemory {
		return Memory.source[id];
	}
	registerSource(id: string) {
		var source = Game.getObjectById<Source>(id);
		if (!source) return;
		var memory = SourceManager.memory(id);
		if (!memory) {
			Memory.source[id] = { harvestRoutes: [], isPlotted: false, forbidden: false };
		}
		RoomManager.memory(source.room.name).sources.push(id);
	}
	main() {
		for (var roomName in Game.rooms) {
			var roomMemory = RoomManager.memory(roomName);
			var sources = roomMemory.sources;
			var needsPlot = _.find(sources, source => !SourceManager.memory(source).isPlotted);
			if (needsPlot) {
				var newPath = this.updatePath(needsPlot);
				if (newPath) {
					SourceManager.memory(needsPlot).harvestRoutes.push(newPath);
					roomMemory.role[CreepRole.harvester].capacity = _.sum(_.map(sources, source => {
						var memory = SourceManager.memory(source);
						return memory.harvestRoutes.length;
					}));
				}
				console.log("plotted path to " + needsPlot);
				return;
			}
			var needsUpdate = _.find(sources.map(source => {
				var memory = SourceManager.memory(source);
				return _.find(memory.harvestRoutes, route => route.needsUpdate);
			}), route => route);
			if (needsUpdate) {
				this.updatePath(needsUpdate);
				console.log("updated path to " + needsUpdate.sourceId);
				return;
			}
		}
	}
	private updatePath(id: string): SourceRoute
	private updatePath(route: SourceRoute): SourceRoute
	private updatePath(target: any): SourceRoute {
		var p0 = performance.now();
		var route: SourceRoute
		if (_.isString(target)) {
			route = {
				sourceId: target,
				spawnName: null,
				creepName: null,
				needsUpdate: false,
				harvestPos: null,
				toSource: null,
				toSpawn: null
			};
		}
		else route = target;
		var id = route.sourceId;
		var source = Game.getObjectById<Source>(id);
		var memory = SourceManager.memory(id);
		var room = source.room;
		var avoid = memory.harvestRoutes.map(avoidRoute => {
			return room.getPositionAt(
				avoidRoute.harvestPos.x,
				avoidRoute.harvestPos.y);
		});
		if (route.harvestPos) {
			avoid.splice(_.findIndex(avoid, avoidRoute => avoidRoute == route.harvestPos));
		}
		var spawn = source.pos.findClosest<Spawn>(FindCode.FIND_MY_SPAWNS);
		var toSpawn = source.pos.findPathTo(spawn, { ignoreCreeps: true, avoid: avoid });
		if (!toSpawn || toSpawn.length == 0) {
			memory.isPlotted = true;
			return null;
		}
		toSpawn.pop();
		var atSpawn = room.getPositionAt(toSpawn[toSpawn.length - 1].x, toSpawn[toSpawn.length - 1].y);
		var atSource = room.getPositionAt(toSpawn[0].x, toSpawn[0].y)
		var toSource = atSpawn.findPathTo(atSource, { ignoreCreeps: true, avoid: avoid });
		route.spawnName = spawn.name;
		route.needsUpdate = false;
		route.harvestPos = { x: toSpawn[0].x, y: toSpawn[0].y };
		route.toSource = toSource;
		route.toSpawn = toSpawn;
		return route;
	}
}
interface SourceMemory {
	harvestRoutes: SourceRoute[];
	isPlotted: boolean;
	forbidden: boolean;
}
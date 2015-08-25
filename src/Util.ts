/// <reference path="_references.ts" />

class Util {
	getBlueprintCost(blueprint: string[]) {
		return _.sum(blueprint.map(bodyPart => BODYPART_COST[bodyPart]));
	}
	isObstructed(target: LookAtResult, ignoreCreeps?: boolean): boolean
	isObstructed(target: RoomPosition, ignoreCreeps?: boolean): boolean;
	isObstructed(target: { pos: RoomPosition }, ignoreCreeps?: boolean): boolean;
	isObstructed(target: any, ignoreCreeps?: boolean): boolean {
		var lookAt = target.type ? target : (target.pos ? target.pos.look() : target.look())
		return lookAt.type === "constructionSite" ||
					lookAt.type === "exit" ||
					lookAt.type === "source" ||
					lookAt.type === "structure" ||
					(ignoreCreeps ? true : lookAt.type === "creep") ||
					lookAt.type === "terrain" && 
					lookAt.terrain !== "normal" && 
					lookAt.terrain !== "swamp"
	}
	findPathableAround(target: RoomPosition, ignoreCreeps?: boolean): RoomPosition[];
	findPathableAround(target: { pos: RoomPosition }, ignoreCreeps?: boolean): RoomPosition[];
	findPathableAround(target: any, ignoreCreeps?: boolean): RoomPosition[] {
		var pos: RoomPosition = target.pos ? target.pos : target;
		var room = Game.rooms[pos.roomName];
		var pathableTiles: RoomPosition[] = [];
		var area = room.lookAtArea(pos.y - 1, pos.x - 1, pos.y + 1, pos.x + 1);
		for (var x in area) {
			for (var y in area[x]) {
				var results: LookAtResult[] = y;
				if (!results.some(lookAt => this.isObstructed(lookAt))) {
						pathableTiles.push(room.getPositionAt(x, y));
					}
			}
		}
		return pathableTiles;
	}
}
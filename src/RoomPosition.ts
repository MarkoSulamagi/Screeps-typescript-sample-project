/// <reference path="_references.ts" />
interface RoomPosition {
	isObstructed(ignoreCreeps?: boolean): boolean;
	findPathableAround(ignoreCreeps?: boolean): RoomPosition[];
}
RoomPosition.prototype.isObstructed = function(ignoreCreeps?: boolean) {
	var lookAt: LookAtResult = this.lookAt();
	return lookAt.type === "constructionSite" ||
		lookAt.type === "exit" ||
		lookAt.type === "source" ||
		lookAt.type === "structure" ||
		(ignoreCreeps ? true : lookAt.type === "creep") ||
		lookAt.type === "terrain" &&
		lookAt.terrain !== "normal" &&
		lookAt.terrain !== "swamp"
}
RoomPosition.prototype.findPathableAround = function(ignoreCreeps?: boolean) {
	var pos: RoomPosition = this;
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
/// <reference path="screeps.d.ts" />

interface RoomPosition {
	getId(): string;
	isObstructed(ignoreCreeps?: boolean): boolean;
	findPathableAround(ignoreCreeps?: boolean): RoomPosition[];
	fastPathTo(target: RoomPosition|{ pos: RoomPosition }|string): PathStep[];
	getDirectionPos(direction: number): RoomPosition;
}
RoomPosition.prototype.getId = function() {
	var _this: RoomPosition = this;
	return _this.x.toString() + _this.y.toString() + _this.roomName.toString();
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
RoomPosition.prototype.fastPathTo = function(target: any, opts?: FindPathOpts) {
	var src: RoomPosition = this;
	var dest: RoomPosition = target.pos ? target.pos : target;
	var path = Memory.paths[src.getId() + dest.getId()]
	if (!path) {
		var steps = src.findPathTo(dest, opts);
		path = {usagePerTick: 0, lastUsed: 0, steps: steps};
	}
	if (path.lastUsed === Game.time) path.usagePerTick += 1;
	else {
		path.lastUsed = Game.time;
		path.usagePerTick = 1;
	}
	return path.steps;
}
RoomPosition.prototype.getDirectionPos = function(direction: number) {
	var _this: RoomPosition = this;
	switch (direction) {
		case TOP:
			return new RoomPosition(_this.x, _this.y - 1, _this.roomName);
		case TOP_RIGHT:
			return new RoomPosition(_this.x + 1, _this.y - 1, _this.roomName);
		case RIGHT:
			return new RoomPosition(_this.x + 1, _this.y, _this.roomName);
		case BOTTOM_RIGHT:
			return new RoomPosition(_this.x + 1, _this.y + 1, _this.roomName);
		case BOTTOM:
			return new RoomPosition(_this.x, _this.y + 1, _this.roomName);
		case BOTTOM_LEFT:
			return new RoomPosition(_this.x - 1, _this.y + 1, _this.roomName);
		case LEFT:
			return new RoomPosition(_this.x - 1, _this.y, _this.roomName);
		case TOP_LEFT:
			return new RoomPosition(_this.x - 1, _this.y - 1, _this.roomName);
		default:
			return _this;
	}
}
interface Memory {
	paths: { [id: string]: Path }
}
interface Path {
	usagePerTick: number;
	lastUsed: number;
	steps: PathStep[];
}
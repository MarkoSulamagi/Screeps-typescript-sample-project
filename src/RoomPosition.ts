/// <reference path="screeps.d.ts" />

interface RoomPosition {
	getId(): string;
	isObstructed(ignoreCreeps?: boolean): boolean;
	findPathableAround(ignoreCreeps?: boolean): RoomPosition[];
	generatePathTo(target: RoomPosition|{ pos: RoomPosition }|string): Path;
	getDirectionPos(direction: number): RoomPosition;
	fromId(id: string): RoomPosition;
}
RoomPosition.prototype.getId = function() {
	var _this: RoomPosition = this;
	return _this.roomName.toString() + "_" + _this.x.toString() + "_" + _this.y.toString();
}
RoomPosition.fromId = function(id: string) {
	var values = id.split("_");
	return new RoomPosition(parseInt(values[1]), parseInt(values[2]), values[0]);
}
RoomPosition.prototype.isObstructed = function(ignoreCreeps?: boolean) {
	var _this: RoomPosition = this;
	var room = Game.rooms[_this.roomName];
	var results = room.lookAt(_this.x, _this.y);
	return _.some(results, lookAt => {
		if (lookAt.terrain == "wall") console.log("ITS A FUCKING WALL");
		return lookAt.type === "constructionSite" ||
			lookAt.type === "exit" ||
			lookAt.type === "source" ||
			lookAt.type === "structure" ||
			(ignoreCreeps ? true : lookAt.type === "creep") ||
			(lookAt.type === "terrain" &&
				lookAt.terrain == "wall")
	});
}
RoomPosition.prototype.findPathableAround = function(ignoreCreeps?: boolean) {
	var pos: RoomPosition = this;
	var room = Game.rooms[pos.roomName];
	var pathableTiles: RoomPosition[] = [];
	var area = room.lookAtArea(pos.y - 1, pos.x - 1, pos.y + 1, pos.x + 1);
	for (var y in area) {
		for (var x in area[y]) {
			if (!_.some(area[y][x], (lookAt: LookAtResult) =>
				lookAt.type === "constructionSite" ||
				lookAt.type === "exit" ||
				lookAt.type === "source" ||
				lookAt.type === "structure" ||
				(ignoreCreeps ? true : lookAt.type === "creep") ||
				(lookAt.type === "terrain" &&
					lookAt.terrain === "wall")
				)) {
				var checkPos = room.getPositionAt(x, y)
				checkPos.createFlag(x.toString() + y.toString(), COLOR_GREEN)
				pathableTiles.push(checkPos);
			}
		}
	}
	return pathableTiles;
}
RoomPosition.prototype.generatePathTo = function(target: any, opts?: FindPathOpts) {
	var src: RoomPosition = this;
	var dest: RoomPosition = target.pos ? target.pos : target;
	var id = src.getId() + "_" + dest.getId();
	if (Memory.paths == null) Memory.paths = {};
	var path = Memory.paths[id]
	if (path == undefined) {
		var steps = src.findPathTo(dest, opts);
		path = { id: id, usagePerTick: 0, lastUsed: 0, steps: steps };
		Memory.paths[path.id] = path;
		console.log("generated new path " + path.id);
	}
	if (path.lastUsed === Game.time) path.usagePerTick += 1;
	else {
		path.lastUsed = Game.time;
		path.usagePerTick = 1;
	}
	return path;
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
	id: string;
	usagePerTick: number;
	lastUsed: number;
	steps: PathStep[];
}
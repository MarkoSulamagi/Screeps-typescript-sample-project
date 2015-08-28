/// <reference path="../_references.ts" />
class PathingManager {
	constructor() {
		if (Memory.paths == null) Memory.paths = {};
	}
	main() {
		_.forOwn(Memory.paths, path => {
			if (Game.time - path.lastUsed > 100) {
				delete Memory.paths[path.id];
				console.log("deleting unused path " + path.id)
			}
		})
	}
}
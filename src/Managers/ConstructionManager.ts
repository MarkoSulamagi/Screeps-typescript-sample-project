/// <reference path="../_references.ts" />
class ConstructionManager {
	constructor() {
		if (Memory.construction == null) Memory.construction = {}
	}
	registerSite(id: string) {
		Memory.construction[id] = {}
	}
	main() {
	}
}
interface Memory {
	newConstructionPos: string[];
}
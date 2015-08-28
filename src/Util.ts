/// <reference path="_references.ts" />
/// <reference path="Castes/ICaste.ts" />


class Util {
	static getBlueprintCost(blueprint: string[]) {
		return _.sum(blueprint.map(bodyPart => BODYPART_COST[bodyPart]));
	}
	static reversePath(path: PathStep[]) {
		return path.reverse().forEach(step => {
			step.dx *= -1;
			step.dy *= -1;
			switch (step.direction) {
				case TOP:
					step.direction = BOTTOM;
					break;
				case TOP_RIGHT:
					step.direction = BOTTOM_LEFT;
					break;
				case RIGHT:
					step.direction = LEFT;
					break;
				case BOTTOM_RIGHT:
					step.direction = TOP_LEFT;
					break;
				case BOTTOM:
					step.direction = TOP;
					break;
				case BOTTOM_LEFT:
					step.direction = TOP_RIGHT;
					break;
				case LEFT:
					step.direction = RIGHT;
					break;
				case TOP_LEFT:
					step.direction = BOTTOM_RIGHT;
					break;
				default:
					break;
			}
		});
	}
	static isCastPopulated(role: number): boolean {
		var casteMemory = Memory.castes[role];
		return (casteMemory.creeps.length + casteMemory.infants.length) < casteMemory.popLimit;
	}
	static areAllCastsPopulated(): boolean {
		return _.values<CasteMemory>(Memory.castes).some(caste => (caste.creeps.length + caste.infants.length) < caste.popLimit)
	}
}
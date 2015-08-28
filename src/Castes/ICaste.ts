/// <reference path="../_references.ts" />

interface ICaste {
	role: CreepRole;
	baseWeight: number;
	getBlueprint(energy: number): string[];
	minimumCost: number;
	main(name: string): number;
	applyBehavior(name: string): number;
	disposeBehavior(name: string): number;
}
interface Memory {
	castes: { [role: number]: CasteMemory };
}
interface CasteMemory {
	creeps: string[];
	infants: string[];
	popLimit: number;
}
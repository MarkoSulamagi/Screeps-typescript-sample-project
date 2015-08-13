declare module screeps {
	/**
	 * A site of a structure which is currently under construction.
	 */
	export interface ConstructionSite {
		/**
		 * A unique object identificator. You can use Game.getObjectById method to retrieve an object instance by its id.
		 */
		id: string;
		/**
		 * Whether this is your own construction site.
		 */
		my: boolean;
		/**
		 * An object with the structure’s owner info
		 */
		owner: Owner;
		/**
		 * An object representing the position of this structure in the room.
		 */
		pos: RoomPosition;
		/**
		 * The current construction progress.
		 */
		progress: number;
		/**
		 * The total construction progress needed for the structure to be built.
		 */
		progressTotal: number;
		/**
		 * The link to the Room object of this structure.
		 */
		room: Room;
		/**
		 * One of the following constants:
		 * STRUCTURE_EXTENSION
		 * STRUCTURE_RAMPART
		 * STRUCTURE_ROAD
		 * STRUCTURE_SPAWN
		 * STRUCTURE_WALL
		 * STRUCTURE_LINK
		 */
		structureType: string;
		/**
		 * Remove the construction site.
		 * @returns Result Code:
		 * OK
		 * ERR_NOT_OWNER
		 */
		remove(): Result;
	}
	/**
	 * Creeps are your units. Creeps can move, harvest energy, construct structures, attack another creeps, and perform other actions.
	 */
	export interface Creep {
		/**
		 * An array describing the creep’s body. Each element contains the following properties:
		 * type: string
		 * body part constant
		 * hits: number
		 * The remaining amount of hit points of this body part.
		 */
		body: BodyPartDefinition[];
		/**
		 * An object with the creep's cargo contents:
		 * energy: number
		 * The current amount of energy the creep is carrying.
		 */
		carry: { energy: number };
		/**
		 * The total amount of resources the creep can carry.
		 */
		carryCapacity: number;
		/**
		 * The movement fatigue indicator. If it is greater than zero, the creep cannot move.
		 */
		fatigue: number;
		hits: number;
		hitsMax: number;
		id: string;
		memory: any;
		my: boolean;
		name: string;
		owner: Owner;
		pos: RoomPosition;
		room: Room;
		spawning: boolean;
		ticksToLive: number;
		attack(target: Creep|Spawn|Structure): Result;
		build(target: ConstructionSite): Result;
		cancelOrder(methodName: string): Result;
		claimController(target: Structure): Result;
	}
	export enum Result {
		OK = 0,
		ERR_NOT_OWNER = -1,
		ERR_BUSY = -4,
		ERR_NOT_FOUND = -5,
		ERR_NOT_ENOUGH_ENERGY = -6,
		ERR_INVALID_TARGET = -7,
		ERR_NOT_IN_RANGE = -9,
		ERR_NO_BODYPART = -12,
		ERR_RCL_NOT_ENOUGH = -14,
		ERR_GCL_NOT_ENOUGH = -15}
	export interface Game {

	}
	export interface RoomPosition {

	}
	export interface Room {

	}
	export interface Spawn {
		
	}
	export interface Structure {
		
	}
	export interface BodyPartDefinition {
		type: string;
		hits: number;
	}
	export interface Owner {
		username: string;
	}
}
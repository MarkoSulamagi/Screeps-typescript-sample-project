/// <reference path="../_references.ts" />
/// <reference path="../Managers/CreepManager.ts" />


class SpawnManager {
	constructor(private creepManager: CreepManager) { }
	initializeRoom(roomName: string) {
		this.creepManager.initializeRoom(roomName);
		var roomMemory = Memory.rooms[roomName];
		roomMemory.infants = {};
		roomMemory.capacity = {};
		this.creepManager.castes.forEach(caste => { roomMemory.infants[caste.role] = [] });
		this.creepManager.castes.forEach(caste => { roomMemory.capacity[caste.role] = 0 });
	}
	registerSpawn(name: string) {
		var p0 = performance.now();
		var spawn = Game.spawns[name];
		var roomMemory = Memory.rooms[spawn.room.name];
		roomMemory.spawns.push(name);
		console.log("registered new spawn " + name + ", time: " + (performance.now() - p0) + "ms");
	}
	getWeight(caste: ICaste, roomName: string) {
		var roomMemory = Memory.rooms[roomName];
		if ((roomMemory.creeps[caste.role].length + roomMemory.infants[caste.role].length) == 0) return caste.baseWeight;
		return caste.baseWeight - (roomMemory.creeps[caste.role].length + roomMemory.infants[caste.role].length) / roomMemory.capacity[caste.role];
	}
	main() {
		for (var room in Memory.rooms) {
			var roomMemory = Memory.rooms[room];
			roomMemory.spawns.forEach(name => {
				if (!Game.spawns[name]) {
					console.log(name + " no longer exists, removing from memory");
					roomMemory.spawns.splice(roomMemory.spawns.indexOf(name));
				}
				for (var casteNumber in roomMemory.infants) {
					roomMemory.infants[casteNumber].forEach(infant => {
						var creep = Game.creeps[infant];
						if (!creep || creep.spawning) return;
						roomMemory.infants[casteNumber].splice(roomMemory.infants[casteNumber].indexOf(infant));
						console.log(infant + " is all grown up");
						this.creepManager.registerCreep(infant);
						this.creepManager.applyBehavior(infant, casteNumber);
						roomMemory.infants[casteNumber].splice(roomMemory.infants[casteNumber].indexOf(infant));
					});
				}
				var spawn = _.max(roomMemory.spawns.map(spawnName => Game.spawns[spawnName]), "energy");
				if (!spawn) return;
				var caste = _.max(this.creepManager.castes.filter(caste => caste.minimumCost <= spawn.energy && (roomMemory.creeps[caste.role].length + roomMemory.infants[caste.role].length) < roomMemory.capacity[caste.role]), caste => this.getWeight(caste, room));
				if (caste.role == undefined) return;
				if ((roomMemory.creeps[caste.role].length + roomMemory.infants[caste.role].length) < roomMemory.capacity[caste.role]) {
					var p0 = performance.now();
					var result = spawn.createCreep(caste.getBlueprint(spawn.energy));
					if (_.isString(result)) {
						var creepName: string = result.toString();
						roomMemory.infants[caste.role].push(creepName);
						console.log("spawning new creep " + creepName + ", time: " + (performance.now() - p0) + "ms");
						console.log(caste.role + " pop in " + room + " at " + (roomMemory.creeps[caste.role].length + roomMemory.infants[caste.role].length) + " out of " + roomMemory.capacity[caste.role]);
						return OK;
					}
					var errorCode: number = +result;
					return errorCode;
				}
				return OK;
			});
		}
		this.creepManager.main();
	}
}
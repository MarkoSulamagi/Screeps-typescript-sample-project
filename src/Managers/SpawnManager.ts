/// <reference path="../_references.ts" />
/// <reference path="../Managers/CasteManager.ts" />


class SpawnManager {
	constructor(private casteManager: CasteManager) { }
	registerSpawn(name: string) {
		var p0 = performance.now();
		var spawn = Game.spawns[name];
		if (Memory.spawns == null) Memory.spawns = {};
		Memory.spawns[name] = { id: spawn.name };
		Memory.rooms[spawn.room.name].spawns.push(spawn.name);
		console.log("registered new spawn " + name + ", time: " + (performance.now() - p0) + "ms");
	}
	getWeight(caste: ICaste, roomName: string) {
		var roomMemory = Memory.rooms[roomName];
		if ((roomMemory.creeps[caste.role].length + roomMemory.infants[caste.role].length) == 0) return caste.baseWeight;
		return caste.baseWeight - (roomMemory.creeps[caste.role].length + roomMemory.infants[caste.role].length) / roomMemory.capacity[caste.role];
	}
	main() {
		_.forOwn(Memory.spawns, (spawnMemory, spawnName) => {
			if (!Game.spawns[spawnName]) {
				console.log(name + " no longer exists, removing from memory");
				delete Memory.spawns[spawnName];
			}
			_.forOwn(Memory.castes, (caste: CasteMemory, casteNumber: string) => {
				caste.infants.forEach(infant => {
					var creep = Game.creeps[infant];
					if (!creep || creep.spawning) return;
					caste.infants.splice(caste.infants.indexOf(infant));
					console.log(infant + " is all grown up");
					this.casteManager.registerCreep(infant);
					this.casteManager.applyBehavior(infant, parseInt(casteNumber));
					caste.infants.splice(caste.infants.indexOf(infant));
				});
			});
		});
		var caste = this.casteManager.castes[parseInt(_.findKey(Memory.castes, casteMem => (casteMem.creeps.length + casteMem.infants.length) < casteMem.popLimit))];
		if (caste == null) return;
		var rooms = _.keys(Memory.rooms).map(roomName => Game.rooms[roomName]);
		var spawn = _.max(_.max(rooms, room => room.energyAvailable).memory.spawns.map(spawnName => Game.spawns[spawnName]), spawnObject => spawnObject.energy);
		if (spawn == null) return;
		var casteMemory = Memory.castes[caste.role];
		if (caste == null) return;
		if ((casteMemory.creeps.length + casteMemory.infants.length) < casteMemory.popLimit) {
			var p0 = performance.now();
			var result = spawn.createCreep(caste.blueprint(spawn.energy));
			if (_.isString(result)) {
				var creepName: string = result.toString();
				casteMemory.infants.push(creepName);
				console.log("spawning new creep " + creepName + ", time: " + (performance.now() - p0) + "ms");
				console.log(caste.role + " pop at " + (casteMemory.creeps.length + casteMemory.infants.length) + " out of " + casteMemory.popLimit);
				return OK;
			}
			var errorCode: number = +result;
			return errorCode;
		}
		return OK;
	}
}
interface SpawnMemory {
	id: string;
}
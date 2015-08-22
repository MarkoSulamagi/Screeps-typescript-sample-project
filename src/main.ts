/// <reference path="_references.ts" />
/// <reference path="Managers/GameManager.ts" />
var t0 = performance.now();
var sim = new GameManager();
sim.main();
var t1 = performance.now();
if ((t1 - t0) > 25) {
	console.log("expensive tick, time: " + (t1 - t0) + "ms");
}
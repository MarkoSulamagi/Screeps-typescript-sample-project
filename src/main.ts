/// <reference path="_references.ts" />
/// <reference path="SimulationGame.ts" />
var t0 = performance.now();
var sim = new SimulationGame();
sim.main();
var t1 = performance.now();
console.log("time: " + (t1 - t0) + "ms");
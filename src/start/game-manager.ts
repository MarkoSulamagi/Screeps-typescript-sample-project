export interface GameManagerInterface {
    globalBootstrap(): void;
    loop(): void;
}

/**
 * Application start class
 */
export class GameManager implements GameManagerInterface {

    constructor() { }

    public globalBootstrap() {
        // Set up your global objects.
        // This method is executed only when Screeps system instantiated new "global".

        // Use this bootstrap wisely. You can cache some of your stuff to save CPU
        // You should extend prototypes before game loop in here.

        console.log("This method is only run when new global is created by Screeps cycle");
    }

    public loop() {
        // Loop code starts here
        // This is executed every tick

        console.log("SUIT UP my creeps!");
    }

}
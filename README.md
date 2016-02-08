# Screeps typescript sample project

This is a sample project to show how to start programming your Screep bots with Typescript. 

This uses Typescript skeleton app: [read more](https://github.com/MarkoSulamagi/Screeps-typescript-skeleton)

## Getting Started

After you create a spawn, this bot will create 4 creeps that are starting to harvest the closest source. The bots harvest, transfer energy back to 
Spawn. If creep's lifespan starts to end, it will refill in Spawn.

> Screep API typescript type definitions are incuded as dependency. See their up to date status in here [GitHUB link](https://github.com/MarkoSulamagi/Screeps-Typescript-Declarations)

Discussion in [screep's community forum](http://support.screeps.com/hc/en-us/community/posts/207116485-Writing-Screep-bots-with-Typescript?page=1#)

### Prerequisities

Required dependencies:

```
NodeJS https://nodejs.org/en/
- `npm` command available in your CLI
```

Optional dependencies (only if you want to follow these installation instructions fully): 

```
GIT https://git-scm.com/
- `git` command available in your CLI (if you want to follow these instructions) 
```

### Installing

```
$ git clone git@github.com:MarkoSulamagi/Screeps-typescript-skeleton.git
$ cd Screeps-typescript-skeleton

$ npm install
```

### Configuring

```
Rename secrets.default.js file to secrets.js
Fill "username" and "password" properties in just renamed secrets.js file with your Screep's username and email. 

**NEVER COMMIT THIS FILE TO ANY VERSION CONTROL** 
```

### Coding and running the app

To run the compiler and uploader, navigate to your project folder and run this command

```
$ npm start
```

Now every time you edit your typescript files, main.js in ./dist folder is uploaded to your Screep scripts into "default" branch.

Project files are in ./src.

```
./src/main.ts - Application bootstrap. Don't change this file
./src/start/game-manager.ts - Your main module. This is where the program starts. There are instructive comments in the class file. 
./src/screeps.d.ts - Typescript interfaces for Screep's API. This includes autocomplete and data types to your project. This file can get outdated if Screep's team adds new functionality or changes something.

./dist - Your compiled files. This will be created automatically. No need to change anything in here.
./typings - Lo-Dash Typescript interfaces. Created automatically and no need to change anything.
```

## Authors

* **Marko Sulamägi** - *Converted Cameron's work to quickly installable TS skeleton app* - [MarkoSulamagi](https://github.com/MarkoSulamagi)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


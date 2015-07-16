`>_` Screeps ai
===============

[![Join the chat at https://gitter.im/avdg/screeps](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/avdg/screeps?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/avdg/screeps.svg)](https://travis-ci.org/avdg/screeps)
[![Code Climate](https://codeclimate.com/github/avdg/screeps/badges/gpa.svg)](https://codeclimate.com/github/avdg/screeps)
[![Coverage Status](https://coveralls.io/repos/avdg/screeps/badge.svg?branch=master)](https://coveralls.io/r/avdg/screeps?branch=master)
[![Dependency Status](https://david-dm.org/avdg/screeps.svg)](https://david-dm.org/avdg/screeps)
[![Dev dependency Status](https://david-dm.org/avdg/screeps/dev-status.svg)](https://david-dm.org/avdg/screeps#info=devDependencies)

> The main goal of this project is to provide a flexible framework for the ai.

## Don't know anything about screeps?
Go to [screeps.com](https://screeps.com) or you could try [🍕💩.ws/🐯🔮👊🍋😜🐱🍩🐰](http://🍕💩.ws/🐯🔮👊🍋😜🐱🍩🐰)

## Install checklists

### First install

- Make sure [node](https://nodejs.org/) 0.12 is installed (0.10 should work fine for now).
- Open a terminal and install grunt with [npm](https://www.npmjs.com/) like this: `npm install -g grunt-cli`.
- If you are familiar with [git](https://git-scm.com/), you can clone from `git@github.com:avdg/screeps.git`.
  - Otherwise you can [get the latest code](https://github.com/avdg/screeps/archive/master.zip) from github.
- Make now sure the terminal is pointing to this project. Then run `npm install` to install dependencies.

### Build configuration

- Open `Gruntfile.js` in an editor, look for `screeps: {`, fill in the options and save the file.
- In a terminal open in a copy of this project: type `grunt deploy`
- If done properly, this should push the code to screeps.com succesfully.

### AI build tricks

- `grunt codegen`: Build generated code
- `grunt deploy`: Pushes code to screeps.com
- `grunt run`: Run the bot in a fake and incomplete simulator
- `grunt test`: To make sure that the code is passing the checks
- `grunt` is currently set to `grunt test`

- `mocha` is available for testing purposes

## `Code` structure

`scripts/main.js` is the boot file, its being executed once a tick in the screeps sandbox.
Please note that not all code of my current ai are included in this repo.

### Ai rules / Ai constrains

- All creeps must have a role

### AI script files

- `_settings.js` Drain for global settings.

#### AI Object

When including `_generated` it will expose the AI global.

The AI object has `_settings` included, so there is no need to include these files.
Simply use the AI object to access their functions.
It also includes code from extensions accessible from `AI.extensions`.

`_generated` is a generated file that only exists in the `build/deploy`
folder when using `grunt deploy` or `grunt codegen`

### Extensions

After using `require('_generated')` it will expose the extensions as
`AI.extensions.<type>.<plugin>`.

These files are coming from the `extensions/` directory with a structure as
`extensions/<package>/<type>/<plugin>`.

These include all files ending with `.js`, excluding the files starting with a `.`
like `.thisFileWillBeIgnoredAnyway.js`.

When generating the extensions, all packages are virtually merged into a single package.
This is how it ends up using the `AI.extensions.<type>.<plugin>` format.

Current extension types are:
- commands
   - Located at `extensions/<any directory>/commands/`
   - Executes flag commands
   - Used when called by `extensions/tools/hooks/flags` or `AI.exec(<command>, ...)`
- hooks (replaced units)
   - Located at `extensions/<any directory>/hooks/`
   - Events when hooks are called:
     - firstTurn: Called when the AI is doing its first turn
     - preController: Called before giving spawns and creepers orders
     - postController: Called before shutting down the AI
     - noSpawn: Called when a spawn has nothing to spawn
       - First parameter is spawn
       - Second parameter is a function to spawn something, simply pass a type or a creep memory object
- library
   - Contains library functions
   - Module.exports keys are accessible as `AI[key]`
- roles
   - Located at `extensions/<any directory>/roles/`
   - Gives creeps orders
   - Called by stage_creeps, the plugin with the corresponding `Creep.memory.role` will be executed
- routines
   - Located at `extensions/<any directory>/routines/`
   - Place to store routines that can be shared to multiple roles of creeps
   - function routine returns boolean
     - When true it means it has successfully completed its routine
     - When false it means it has not been able to do the routine
- targets
   - Collects or filters to get certain type of objects
   - Usable by `AI.get(target, options)` or `Room.get(target, options)` for getting objects
   - `AI.extensions.target.filter` contains customizable filters
- scripts
   - Used to store scripts, allowing them to be executed later
   - module.exports expects to be a function
   - `AI.extensions.scripts.main` will be executed unless `extensionsBootstrap` is set to `false` at the code generator

#### Ai code

`scripts/main` is the boot file. From there it includes other files in the `script/` directory.
Most of these scripts (called stages) utilizes code from extensions.

#### Bonus: run code after turn
Set `global.run` with a function at wish, and it will be executed after the turn.

For example, this code can be typed or pasted in to the console:

```javascript
global.run = function() { console.log(JSON.stringify(Object.keys(AI))); }
```

### Call hierarchy

```
 `- Start timer
 `- Run stage controllers (stage_*.js)
 |   `- `stage_setup()` Prepares game state for AI
 |   `- `AI.emit("firstTurn") Triggers firstTurn hook if current turn reboots the AI
 |   `- `AI.emit("preController")` Triggers firstTurn hook
 |   `- `stage_creeps()` Iterates over every creep (give orders)
 |   `- `stage_spawners()` Iterates over every spawner (give spawn jobs)
 |   `- `AI.emit("postController")` Shutdown and triggers postController hook
 `- Stop timer
```

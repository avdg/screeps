`>_` Screeps ai
===============

[![Build Status](https://travis-ci.org/avdg/screeps.svg)](https://travis-ci.org/avdg/screeps)
[![Code Climate](https://codeclimate.com/github/avdg/screeps/badges/gpa.svg)](https://codeclimate.com/github/avdg/screeps)
[![Coverage Status](https://coveralls.io/repos/avdg/screeps/badge.svg?branch=master)](https://coveralls.io/r/avdg/screeps?branch=master)
[![Dependency Status](https://david-dm.org/avdg/screeps.svg)](https://david-dm.org/avdg/screeps)
[![Dev dependency Status](https://david-dm.org/avdg/screeps/dev-status.svg)](https://david-dm.org/avdg/screeps#info=devDependencies)

> The main goal of this repo is to provide a flexible framework for the ai.

### Ai rules / Ai constrains
- All creeps must have a role

## Installing

- Make sure you've installed [node](https://nodejs.org/) 0.12 (0.10 should currently work fine too).
- Open a terminal and install grunt with [npm](https://www.npmjs.com/) like this: `npm install -g grunt-cli`.
- Make now sure the terminal is pointing to this project. Then run `npm install` to install dependencies.

### Build configuration
- Open `Gruntfile.js` in an editor, look for `screeps: {`, fill in the options and save the file.
- In a terminal open in a copy of this project: type `grunt deploy`
- If done properly, this should push the code to screeps.com succesfully.

### Some tricks

- `grunt deploy`: Pushes code to screeps.com
- `grunt codegen`: Generates `_generated` and puts it in `build/deploy/`
- `grunt test`: To make sure that the code is passing the checks
- `grunt` is currently set to `grunt test`

## `Code` structure

`scripts/main.js` is the boot file, its being executed once a tick in the screeps sandbox.
Please note that not all code of my current ai are included in this repo.

### AI script files

- `_settings.js` Drain for global settings.
- `_generic.js` Functions that only uses javascript features
- `_utils.js` Functions using the screeps API

#### AI Object

When including `_generated` it will expose the AI global.

The AI object has `_api`, `_generic`, `_utils` and `_settings` included,
so there is no need to include these files.
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
   - Events when hooks are called (see `scripts/stage_controller`):
     - firstTurn: Called when the AI is doing its first turn
     - preController: Called before giving spawns and creepers orders
     - postController: Called before shutting down the AI
- roles
   - Located at `extensions/<any directory>/roles/`
   - Gives creeps orders
   - Called by stage_creeps, the plugin with the corresponding `Creep.memory.role` will be executed
- targets
   - Collects or filters to get certain type of objects
   - Usable by `AI.get(target, options)` or `Room.get(target, options)` for getting objects
   - `AI.extensions.target.filter` contains customizable filters

#### Ai code
`scripts/main` is the boot file. From there it includes other files in the `script/` directory.
Most of these scripts (called stages) utilizes code from extensions.

### Call hierarchy
```
 `- Start timer
 `- Run stage controllers (stage_*.js)
 |   `- stage_setup Prepares game state for AI
 |   `- stage_controller.pre() Triggers firstTurn (if needed) and preControllers in hook extensions
 |   `- stage_creeps() Iterates over every creep (give orders)
 |   `- stage_spawners() Iterates over every spawner (give spawn jobs)
 |   `- stage_controller.post() Shutdown and triggers postController in hook extensions
 `- Stop timer
```

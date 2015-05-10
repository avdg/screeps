`>_` Screeps ai
===============

[![Dev dependency Status](https://david-dm.org/avdg/screeps.svg)](https://david-dm.org/avdg/screeps)
[![Dev dependency Status](https://david-dm.org/avdg/screeps/dev-status.svg)](https://david-dm.org/avdg/screeps#info=devDependencies)
[![Build Status](https://travis-ci.org/avdg/screeps.svg)](https://travis-ci.org/avdg/screeps)
[![Coverage Status](https://coveralls.io/repos/avdg/screeps/badge.svg?branch=master)](https://coveralls.io/r/avdg/screeps?branch=master)

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
- `grunt test`: To make sure that the code is passing the checks
- `grunt` is currently set to `grunt test`

## `Code` structure

`scripts/main.js` is the boot file, its being executed once a tick in the screeps sandbox.
Please note that not all code of my current ai are included in this repo.

### Files in `scripts/`

#### Special files
- `_generic.js` Contains main library functions
- `_utils.js` Contains library functions that reads from or uses the screeps api
- `_settings.js` Drain for global settings

When using `grunt deploy`, the command will copy the content of `scripts/` to
`build/deploy`, `_generated.js` will be automagically be generated and be put in
the `build/deploy` folder as well.

`_generated.js` contains generated code. The code contains code from extensions
and some more stuff may be added to it in the future.

#### Templates
- `command_FOO.js` Flag command template
- `role_FOO.js` Creep's role template
- `unit_FOO.js` Resource/task unit template

There is no template for `stages_*.js`, just make it fit in `main.js`

#### Ai code
##### Main
*Bootstrap file - executes stages keeps track of time*
- `main.js` Main ai script

##### Stage
*Main stages of the ai - called from main*
- `stage_*.js` Runs a main stage of the ai **called manually by main.js**

##### Unit
*Sets up and shuts down ai components, data and settings - called from stage_controller*
- Unit extensions can be found in `extensions/<any directory>/roles/`

##### Roles
*Creep's given policy on what to do with their role - called by stage_creeps*
- Role extensions can be found in `extensions/<any directory>/roles/`

##### Commands
*Executes flag commands - called by unit_flags or `require('_utils').exec(<command>, ...)`*
- Command extensions can be found in `extensions/<any directory>/commands/`

#### Tools
*Should make writing ai's a little bit easier*
- Use `grunt deploy` to send code to the screeps simulator

### Call hierarchy
```
 `- Start timer
 `- Run stage controllers (stage_*.js)
 |   `- stage_controller.pre() Setup and triggers preControllers in unit extensions
 |   `- stage_creeps() Iterates over every creep (give orders)
 |   `- stage_spawners() Iterates over every spawner (give spawn jobs)
 |   `- stage_controller.post() Shutdown and triggers postController in unit extensions
 `- Stop timer
```

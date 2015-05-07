`>_` Screeps ai
===============

[![Dev dependency Status](https://david-dm.org/avdg/screeps.svg)](https://david-dm.org/avdg/screeps)
[![Dev dependency Status](https://david-dm.org/avdg/screeps/dev-status.svg)](https://david-dm.org/avdg/screeps#info=devDependencies)
[![Build Status](https://travis-ci.org/avdg/screeps.svg)](https://travis-ci.org/avdg/screeps)
[![Coverage Status](https://coveralls.io/repos/avdg/screeps/badge.svg?branch=master)](https://coveralls.io/r/avdg/screeps?branch=master)

> The main goal of this repo is to provide a flexible framework for the ai.

### Ai rules / Ai constrains
- All creeps must have a role

## `Code` structure

Main.js should be the script called first by the ai-runner

### Files in `script/`

#### Special files
- `_generic.js` Contains main library functions
- `_utils.js` Contains library functions that reads from or uses the screeps api
- `_settings.js` Drain for global settings

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
- `unit_*.js` Runs a unit to manage a certain resource or task
- `units.js` A dictionary of active units **activate your units here**

##### Roles
*Creep's given policy on what to do with their role - called by stage_creeps*
- `role_*.js` Run's creeps with fitting role
- `roles.js` A dictionary of active roles **activate your roles here**

##### Commands
*Executes flag commands - called by unit_flags or `require('_utils').exec(<command>, ...)`*
- Command extensions can be found in `extensions/<any directory>/commands/`

#### Tools
*Should make writing ai's a little bit easier*
- Use `grunt deploy` to send code to the screeps simulator

### Call hierarchy

#### `Main`
```
 `- Start timer
 `- Run stage controllers (stage_*.js)
 |   `- stage_controller.pre() (see section stage_controller)
 |   `- stage_creeps()
 |   |    `- Runs roles (role_*.js)
 |   `- stage_spawners()
 |   `- stage_controller.post() (see section stage_controller)
 `- Stop timer
```

#### `Stage_controller`
```
 `- Runs preController or postController function of unit controllers (unit_*.js)
     `- unit_flag.pre() Plays with commands from `extensions/<any directory>/commands/` when needed
```

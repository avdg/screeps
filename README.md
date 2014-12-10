`>_` Screeps ai
===============

The main goal of this repo is to provide a flexible framework for the ai.

### Ai rules
- All creeps must have a role

## `Code` structure

Main.js should be the script called first by the ai-runner

### Files in `script/`

#### Special files
- `_generic.js`: Contains main library functions
- `_settings.js`: Drain for global settings

#### Templates
- `command_FOO.js`: flag command template
- `role_FOO.js`: creep's role template
- `unit_FOO.js`: resource/task unit template

There is no template for stages because of the manual main.js require

#### Ai code
Main
- `main.js`: Main ai script

Commands
- `commmand_*.js`: Runs user commands (might also contain usefull scripts)
- `commands.js`: A dictionary of active commands **activate your commands here**

Roles
- `role_*.js`: Run's creeps with fitting role
- `roles.js`: A dictionary of active roles **activate your roles here**

Stage
- `stage_*.js`: Runs a main stage of the ai **called manually by main.js**

Unit
- `unit_*.js`: Runs a unit to manage a certain resource or task
- `units.js`: A dictionary of active units **activate your units here**

#### Tools
- sync.js A tool to sync local files up to the browser running creeps

### Call hierarchy

```
<== main ==>
 `- Start timer
 `- Run stage controllers (stage_*.js)
 |   `- stage_controller.pre() (see section stage_controller)
 |   `- stage_creeps()
 |   |    `- Runs roles (role_*.js)
 |   `- stage_spawners()
 |   `- stage_controller.post() (see section stage_controller)
 `- Stop timer

<== stage_controller ==>
 `- runs preController or postController function of unit controllers (unit_*.js)
     `- unit_flag.pre() Plays with commands from command_*.js when needed
```

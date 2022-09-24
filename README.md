![](https://img.shields.io/badge/Foundry-v0.10.0-informational)
![Latest Release Download Count](https://img.shields.io/github/downloads/johnnolan/wild-magic-surge-5e/latest/module.zip)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fwild-magic-surge-5e&colorB=4aa94a)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=johnnolan_wild-magic-surge-5e&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=johnnolan_wild-magic-surge-5e)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=johnnolan_wild-magic-surge-5e&metric=coverage)](https://sonarcloud.io/summary/new_code?id=johnnolan_wild-magic-surge-5e)

[![Translation status](https://weblate.foundryvtt-hub.com/widgets/wild-magic-surge-5e/-/main/287x66-black.png)](https://weblate.foundryvtt-hub.com/engage/wild-magic-surge-5e/)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/X8X354DCG)

# Wild Magic Surge 5e

This module provide various bits of functionality to help automate the `Wild Magic Surge` feat within the `dnd5e` game system.

## Top Level Features

- **Default**: On a roll of 1, trigger a Wild Magic Surge (Default and can be configured in the Dice Formula options)
- **Incremental Check**: Every time a spell is cast, the threshold is increased by `1` for a Surge. Once triggered the threshold is reset back to `1`.
- **Incremental Check (Chaotic)**: For the amazingly awesome chaotic players and GMs. Instead of increasing every time a spell is cast, at the start of every turn in combat, the threshold is increased by `1` for a Surge to a maximum of `10`. Once triggered the threshold is reset back to `1`.
- **Spell Level Dependent Rolls**: Wild Magic Surge triggers dependent on spell level (Set options below).
- **Descending Dice**: On no Surge roll `d20`, `d12`, `d10`, `d8`, `d6` then `d4` until a surge, then reset back to `d20`.

- **Barbarian - Path of Wild Magic - Tasha's Cauldron of Everything**: When you enter a Rage as a Wild Magic Barbarian, the module will auto roll on a table. **Must enable `Enable Auto Roll on a Wild Magic Surge Table` to work**. Specify a custom table (TCOE table not included).

Additional options include

- Prompt to roll on a `1st level` or higher spell slot used with the `Wild Magic Surge` feat
  - Optionally Surge Check on `Cantrips`, not just `1st Level` or higher
- Whisper results to GM
- Auto roll for Wild Magic Surge
- Auto roll Custom Roll Table for effect
- `Tides of Chaos` auto recharge
- Custom dice roll check for surge
  - default is `1d20` and a roll of `1`
  - Can also set multiple target results using a comma seperated value list
- Ability to set your own roll evaluation dependent on the spell level used
- Hooks for custom macros and other modules to use
- Track incremental wild magic surge count on token
- Optionally track NPCs Wild Magic Surges
- `Dice So Nice` integration if the module is enabled
- Discern between sorcerer spells and other spells when multiclassing
- Auto surge when Tides of Chaos is used
- Auto play animation effect on a Wild Magic Surge
- Execute a Macro on a Wild Magic Surge
  - Includes a set of example macros on how you can use this feature. Can be found in the compendium.
- [Optionally send Wild Magic Surge event](#encounter-statistics-module-integration) to [Encounter Statistics Module](https://github.com/johnnolan/encounter-stats) to track history of surges in your campaign.

For a full overview of settings available, see the [Module Settings](./docs/OPTIONS.md) page.

## Contents

Below is a list of links to help you setup the module and your Player Characters.

* [Prerequisites and setting up your Player Character to work with this module](./docs/SETTING_UP_PLAYER.md)
* [Using built in Hooks](./docs/HOOKS.md)
* [Track Incremental and Descending Die Wild Magic Surge count on token](./docs/TRACK_SURGE_TOKEN.md)

## Options

### Wild Magic Surge Mode

Choose between the following options to track your Wild Magic Surges

- **Default**: On a roll of `1`, trigger a Wild Magic Surge (Default and can be configured in the Dice Formula options)
- **Incremental Check**: Every time a spell is cast, the threshold is increased by `1` for a Surge. Once triggered the threshold is reset back to `1`.
- **Incremental Check (Chaotic)**: For the amazingly awesome chaotic players and GMs. Instead of increasing every time a spell is cast, at the start of every turn in combat, the threshold is increased by `1` for a Surge to a maximum of `10`. Once triggered the threshold is reset back to `1`.
- **Spell Level Dependent Rolls**: Wild Magic Surge triggers dependent on spell level (Set options below).

[![Whisper chat results to GM](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/settings.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/settings.jpg)

### Whisper chat results to GM

Whisper all message to the GM in case you want to be nice and fudge the rolls.

[![Whisper chat results to GM](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/whisper-chat.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/whisper-chat.jpg)

### Auto Roll a check for Wild Magic Surge instead of just a reminder to roll

The additional option `Auto Roll for a Wild Magic Surge instead of just the prompt` will auto roll in the background for you and post the result in the Chat.

Based on your settings, it will show a prompt that a `Wild Magic Surge` has occured or not.

This message is configurable should you wish.

[![Auto Roll a check for Wild Magic Surge instead of just a reminder to roll](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/auto-roll-check.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/auto-roll-check.jpg)

### Send Incremental Check charge to chat

When enabled, each time a incremental check for a surge changes it is posted to Chat for others to see.

[![Send Incremental Check charge to chat](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/increment-chat.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/increment-chat.jpg)

### Enable Auto Roll on a Wild Magic Surge Table

This option takes things a step further and will roll a Roll Table on a `Wild Magic Surge`.

You can configure a Custom Roll Table by replacing the default name in the settings with your own version.

[![Enable Auto Roll on a Wild Magic Surge Table](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/enable-auto-roll-table.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/enable-auto-roll-table.jpg)

### Execute a GM Macro on a Wild Magic Surge

When a surge happens you can specify your own macro to run. Note this will only trigger a macro setup on the GM user.

Included is a compendium containing examples and the javascript for them are in [/scripts/macros](../scripts/macros/).

[![Execute a GM Macro on a Wild Magic Surge](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/macro-surge.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/macro-surge.jpg)

### Tides of Chaos Recharge

Another option allows you to recharge `Tides of Chaos` automatically on a `Wild Magic Surge`.

[![Tides of Chaos Recharge](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/tides-of-chaos.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/tides-of-chaos.jpg)

### Dice Formula

Set a custom dice formula you want to roll to check for a `Wild Magic Surge`. The default is `1d20`.

[![Dice Formula](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/dice-formula.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/dice-formula.jpg)

### Track Wild Magic Surge for NPCs

Enabling this setting will automate Wild Magic Surge for Non Player Characters as well as Player Characters. Ensure the NPC has the `Wilg Magic Surge` feat.

[![Dice Formula](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/track-npcs.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/track-npcs.jpg)

### The target result of the dice roll

What is the dice roll result you want to check against. The default is `1`.

Can also set multiple target results using a comma seperated value list like `1, 3, 5, 10, 19`

[![The target result of the dice roll](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/target-result-dice-roll.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/target-result-dice-roll.jpg)

### Roll result boolean expression

Based on the target dice roll, should the result be less/greater than or equal to the result to trigger the `Wild Magic Surge`. The default is `=`.

[![Roll result boolean expression](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/roll-result-boolean.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/roll-result-boolean.jpg)

### Auto surge on spell use after Tides of Chaos has been used

When Tides of Chaos is used, any 1st level spell and higher will trigger a surge and restore your Tides of Chaos.

[![Auto surge on spell use after Tides of Chaos has been used](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/auto-surge-toc.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/auto-surge-toc.jpg)

### Setup varying Wild Magic Surge triggers dependent on spell level

Adds the ability to set your own roll evaluation dependent on the spell level used.

For example

- A lvl 1 spell only triggers wild magic if a 1 is rolled on the d20
- A lvl 4 spell triggers if a 4 or lower is rolled
- A lvl 9 triggers if a 9 or lower is rolled

Special thanks to [Jackolas126](https://github.com/Jackolas126) for this suggestion.

[![Setup varying Wild Magic Surge triggers dependent on spell level](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/varying-triggers.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/varying-triggers.jpg)

### Spell Regex for Multiclass spells

The RegEx to differentiate between sorcerer spells and non sorcerer spells. This assumes the sorcerer spells to be renamed like `Magic Missile (S)`. Special characters must be escaped!

Special thanks to [Jakob Huber](https://github.com/gh7531) for this suggestion and Pull Request.

[![Spell Regex for Multiclass spells](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/multiclass-regex.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/multiclass-regex.jpg)

### Play animation on Surge

On a Wild Magic Surge, the token that triggered the Surge will get an animation play. This requires the awesome [https://github.com/fantasycalendar/FoundryVTT-Sequencer](Sequencer) and [https://github.com/Jules-Bens-Aa/JB2A_DnD5e](JB2A) modules to be installed and active.

[![Play animation on Surge](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/play-animation.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/play-animation.jpg)

### Roll for surge on Cantrips

Standard rules are 1st Level and higher to trigger a surge. This also enables it for Cantrips.

[![Roll for surge on Cantrips](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/roll-cantrips.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/roll-cantrips.jpg)

### Encounter Statistics Module Integration

Optionally send Wild Magic Surge event to [Encounter Statistics Module](https://github.com/johnnolan/encounter-stats) to track history of surges in your campaign.

[![Encounter Statistics Module Integration option](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/opt-encounter-stats.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/opt-encounter-stats.jpg)

#### Example output

[![Encounter Statistics Module Example output](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/encstats-example.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/encstats-example.jpg)


## Contributing

The contributing guidelines can be found in the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

Our Code of Conduct can also be found in the [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) file.

### Translations

This project is setup to use Weblate to make it easier to create translations by the community.

If you are amazing and want to contribute then you can visit this projects Weblate page at [https://weblate.foundryvtt-hub.com/engage/wild-magic-surge-5e/](https://weblate.foundryvtt-hub.com/engage/wild-magic-surge-5e/) and add translations yourself to be shared with the community.

## License

Wild Magic Surge 5e is released under the [MIT License](./LICENSE).

## Contact

For issues, please raise a bug in Github giving as much detail as you can. I will try and fix things depending on fatherhood responsibilities [https://github.com/johnnolan/wild-magic-surge-5e/issues](https://github.com/johnnolan/wild-magic-surge-5e/issues)

You can also find me lurking around on the Foundry VTT Discord [https://discord.gg/foundryvtt](https://discord.gg/foundryvtt). My Discord Tag is `JB#2780`.

[buymeacoffee-shield]: https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/badges/buymeacoffee.png
[buymeacoffee]: https://www.buymeacoffee.com/johnnolandev

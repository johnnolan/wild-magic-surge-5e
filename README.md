![](https://img.shields.io/badge/Foundry-v0.10.0-informational)
![Latest Release Download Count](https://img.shields.io/github/downloads/johnnolan/wild-magic-surge-5e/latest/module.zip)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fwild-magic-surge-5e&colorB=4aa94a)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=johnnolan_wild-magic-surge-5e&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=johnnolan_wild-magic-surge-5e)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=johnnolan_wild-magic-surge-5e&metric=coverage)](https://sonarcloud.io/summary/new_code?id=johnnolan_wild-magic-surge-5e)
[![CodeFactor](https://www.codefactor.io/repository/github/johnnolan/wild-magic-surge-5e/badge)](https://www.codefactor.io/repository/github/johnnolan/wild-magic-surge-5e)

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
- Execute a GM Macro on a Wild Magic Surge

For a full overview of settings available, see the [Module Settings](./docs/OPTIONS.md) page.

## Contents

Below is a list of links to help you setup the module and your Player Characters.

* [Prerequisites and setting up your Player Character to work with this module](./docs/SETTING_UP_PLAYER.md)
* [Using built in Hooks](./docs/HOOKS.md)
* [Track Incremental and Descending Die Wild Magic Surge count on token](./docs/TRACK_SURGE_TOKEN.md)
* [Module Settings](./docs/OPTIONS.md)

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

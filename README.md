![](https://img.shields.io/badge/Foundry-v0.7.9-informational)
![](https://img.shields.io/badge/Foundry-v0.8.6-informational)
![Latest Release Download Count](https://img.shields.io/github/downloads/johnnolan/wild-magic-surge-5e/latest/module.zip)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fwild-magic-surge-5e&colorB=4aa94a)
[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fwild-magic-surge-5e%2Fshield%2Fendorsements)](https://www.foundryvtt-hub.com/package/wild-magic-surge-5e/)
[![Foundry Hub Comments](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fwild-magic-surge-5e%2Fshield%2Fcomments)](https://www.foundryvtt-hub.com/package/wild-magic-surge-5e/)

[![Buy me a coffee][buymeacoffee-shield]][buymeacoffee]

# Wild Magic Surge 5e

This module provide various bits of functionalityto help automate the `Wild Magic Surge` feat when casting a `level 1 spell` or higher.

Included is a basic prompt, Tides of Chaos recharge, custom d100 tables and fully automated rolling. See below for all the options available.

## Installation

To install, follow these instructions:

- Inside Foundry, select the Game Modules tab in the Configuration and Setup menu.
- Click the Install Module button and enter the following URL: `https://github.com/johnnolan/wild-magic-surge-5e/releases/latest/download/module.json`
- Click Install and wait for installation to complete.

Alternatively, use the integrated module manager in Foundry.

Foundry modules page: [https://foundryvtt.com/packages/wild-magic-surge-5e](https://foundryvtt.com/packages/wild-magic-surge-5e)

## Configure

This module gives you two ways of playing.

### Default

The first option is to show a prompt every time a player uses a 1st level or higher spell in the chat window. _This is enabled by default and should always be checked, even to enable the automatic options._

### Whisper chat results to GM

Whisper the results of the rolls in case you want to be a nice GM and fudge the rolls.

### Auto Roll d20 instead of just the prompt

The additional option `Auto Roll d20 instead of just the prompt` will auto roll in the background for you post automatically the result in the Chat.

Upon a `1` it will show a prompt that a Wild Magic Surge has occured and that they should roll a d100. This message is configurable should you wish.

### Enable Auto Roll on a Wild Magic Surge Table

This option takes things a step further and will auto roll a `d100` on a roll of `1` on the previous auto roll option.

You can configure a Custom Roll Table by replacing the default name in the settings with your own version.

Should you wish, there is also included a Roll Table with the `Wild Magic Surge 5e Player Handbook` settings.

You can add this to your Roll Table collection by going to the `Compendium Pack` section called `Wild Magic Surge 5e (PHB)` in the `RollTable` section. Open this up and choose `import` to add it.

### Tides of Chaos Recharge

Another option allows you to, on a roll of `1`, recharge Tides of Chaos automatically.

## Requirements

This module requires the `dnd5e` game system to work. Your character will also need to have a `Feat` set in their character called `Wild Magic Surge`.

## Contact

For issues, please raise a bug in Github giving as much detail as you can. I will try and fix things depending on fatherhood responsibilities [https://github.com/johnnolan/wild-magic-surge-5e/issues](https://github.com/johnnolan/wild-magic-surge-5e/issues)

You can also find me lurking around on the Foundry VTT Discord [https://discord.gg/foundryvtt](https://discord.gg/foundryvtt). My Discord Tag is `JB#2780`.

[buymeacoffee-shield]: https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/badges/buymeacoffee.png
[buymeacoffee]: https://www.buymeacoffee.com/johnnolandev

![](https://img.shields.io/badge/Foundry-v0.7.9-informational)
![Latest Release Download Count](https://img.shields.io/github/downloads/johnnolan/wild-magic-surge-5e/latest/module.zip)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fwild-magic-surge-5e&colorB=4aa94a)
[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fwild-magic-surge-5e%2Fshield%2Fendorsements)](https://www.foundryvtt-hub.com/package/wild-magic-surge-5e/)
[![Foundry Hub Comments](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fwild-magic-surge-5e%2Fshield%2Fcomments)](https://www.foundryvtt-hub.com/package/wild-magic-surge-5e/)

# Wild Magic Surge 5e

This module adds a Chat message every time a player with the feat `Wild Magic Surge` casts a `level 1 spell` or higher.

I was getting fed up of having to remember whenever this occured so I created this small module to alert me.

You have an option to change the default message in the module settings page should you wish among other options. See the configure section below for more details.

## Configure

This module gives you two ways of playing.

1. (Default) The first option is to show a prompt every time a player uses a 1st level or higher spell in the chat window.

2. The additional option `Auto Roll d20 instead of just the prompt` will auto roll in the background for you and upon a `1` will show a prompt that a Wild Magic Surge has occured and that they should roll a d100. This message is configurable should you wish.

## Installation

To install, follow these instructions:

- Inside Foundry, select the Game Modules tab in the Configuration and Setup menu.
- Click the Install Module button and enter the following URL: `https://github.com/johnnolan/wild-magic-surge-5e/releases/latest/download/module.json`
- Click Install and wait for installation to complete.

Alternatively, use the integrated module manager in Foundry.

## Requirements

This module requires `betterrolls5e` and the `dnd5e` game system to work. Your character will also need to have a `Feat` set in their character called `Wild Magic Surge`.

I will look to remove dependencies in the future and make this more configurable as I level up in Foundry.

This module should prompt you on install if you don't have these dependencies installed.

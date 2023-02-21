# Changelog

## 4.0.4 - 2023-02-21

### Documentation

- Update `Automate Wild Magic Surge` setting description

## 4.0.3 - 2023-02-20

### Bug Fixes

- If displaying Player Triggered Roll Table chat option, logic now shows the message as a public roll rather than using the selected GM roll type (private, blind rolls, etc). Message will still be hidden if you have specifically choosen to whisper rolls in settings.

## 4.0.2 - 2023-02-07

### Translations

- Translated using Weblate (French)

## 4.0.1 - 2023-02-05

### Versioning

- Set compatibility for dnd5e 2.1.4

## 4.0.0 - 2023-02-05

### Breaking Change

Due to the latest dnd5e changes, tracking of surge increments for Incremental Check and Descending Dice has been reworked.

In order to display the surge increment on your token you now have to use one of the three available Resources on the character sheet.

Optionally you can select None and it will silently track the increments in the background.

More information on how to set this up can be found in the readme [https://github.com/johnnolan/wild-magic-surge-5e/blob/main/docs/TRACK_SURGE_TOKEN.md](https://github.com/johnnolan/wild-magic-surge-5e/blob/main/docs/TRACK_SURGE_TOKEN.md)

## 3.14.2 - 2023-01-11

### Translations

- Translated using Weblate (French)

## 3.14.1 - 2023-01-10

### Translations

- Translated using Weblate (French)

## 3.14.0 - 2023-01-03

### Feature

- Allow more complex `Dice Formula` in the `Standard PHB Variant` setting. E.g. `1d20 + 5` or `1d10 + 2` for more niche variants.
- Contribution by @ZeroXNoxus

## 3.13.2 - 2023-01-03

### Bug Fixes

- Add wild magic feat check when spell regex option is enabled - Fixes a situation when inverse regex option is selected it would cause any spell caster to trigger a surge check even when they don't have the feat setup.

## 3.13.1 - 2023-01-02

### Bug

- Reset Incremental and Descending count on Tides of Chaos Surge properly

## 3.13.0 - 2022-12-28

### Features

- Add Player Trigger option to allow Players to roll on a Magic Surge Table via a chat message
- Changed Auto Roll Table option to a drop down of choices to include the above

### Bugs

- Fixes regex inverted surge check where any item cast would trigger a surge

## 3.12.1 - 2022-12-24

### Refactor

- Add missing translations
- Renamed Regex feature to Spell Filter to better describe its purpose

## 3.12.0 - 2022-12-24

### Feature

- Add option to exclude specific spells from triggering a Wild Magic Surge. Can be found in the Spell Regex options.

## 3.11.1 - 2022-12-23

### Bug Fixes

- Fixes issue where new functionality to trigger surge from the player no longer triggers the run macro function on the GM.

## 3.11.0 - 2022-12-21

### Features

- Adds CHANGELOG.md for tracking module changes

## 3.10.0

### Bug Fixes

- Whisper message bug fix

## 3.9.7

### Features

- Update compatibility versions

## 3.9.3

### Features

- Translated using Weblate (German)

## 3.9.2

### Features

- French and Spanish Translations update from Foundry Hub

## 3.9.0

### Bug Fixes

- Tidy chat message prompts and settings.
- Adds toggle for chat messages

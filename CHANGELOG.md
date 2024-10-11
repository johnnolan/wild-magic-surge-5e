# Changelog

## 6.0.0 - 2024-10-11

### Compatibility

* May be the final update to this module to keep it going, will see the extent of rewrite required in 4.4.0 of DND5e.
* No longer compatible with anything below 4.0.4.

## 5.0.0 - 2024-07-13

### Feature

- Update to V12

## 4.6.1 - 2024-06-19

### Feature

- Fix Descending Dice error when no Resource Tracking is enabled

## 4.6.0 - 2024-02-14

### Feature

- Add support for Controlled Chaos in the WMS feat. When level 14 or higher and auto roll on Magic Surge Table is enabled it will roll and return 2 results for the player to choose from.

## 4.5.1 - 2023-06-11

### Feature

- Update to Foundry V11

## 4.4.2 - 2023-04-17

### Translations

- Translated using Weblate (French)

## 4.4.1 - 2023-04-11

### Features

- Set a custom minimum level to trigger a Wild Magic Surge. For example 3 would only trigger on spells cast at level 3 or higher.

### Bug Fixes

- Fix issue with resource not being set on incremental checks

## 4.3.0 - 2023-04-07

### Features

- Allow users to trigger WMS through macros

See readme for more details here on how to set up [https://github.com/johnnolan/wild-magic-surge-5e#trigger-a-wild-magic-surge-from-your-own-macro](https://github.com/johnnolan/wild-magic-surge-5e#trigger-a-wild-magic-surge-from-your-own-macro)

## 4.2.1 - 2023-03-26

### Bug Fixes

- Allows tracking of WMS when no token is present on canvas

## 4.2.0 - 2023-03-12

### Features

- Add support for JB2A Patreon module animations.
- Previously only work with the free version. If you have the Patreon version, it will now use animations from that module.
- Note: You can create your own animations on a surge by following the guide here https://github.com/johnnolan/wild-magic-surge-5e#execute-a-gm-macro-on-a-wild-magic-surge and using the example script.

## 4.1.2 - 2023-03-03

### Versioning

- Bump compatible system version

## 4.1.1 - 2023-03-03

### Translations

- Translated using Weblate (French) - Thank you Marc Feuillen!

## 4.1.0 - 2023-02-24

### Features

- [Enable custom rolls for Spell Level Dependent Rolls](https://github.com/johnnolan/wild-magic-surge-5e/blob/main/docs/SPELL_LEVEL_DEPENDENT.md)
- Add custom Cantrip option for Spell Level Dependent Rolls

### Documentation

- Add Spell Level Dependent Rolls documentation
- Tidied README

## 4.0.6 - 2023-02-21

### Features

- Allow Path of Wild Magic Barbarian to use `Player Trigger Roll` option as well as `Auto Roll Table` option for surges.

### Documentation

- Add seperate documentation on how to setup the Path of Wild Magic Barbarian

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

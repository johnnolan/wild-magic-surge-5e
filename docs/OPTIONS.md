# Options

## Wild Magic Surge Mode

Choose between the following options to track your Wild Magic Surges

- **Default**: On a roll of `1`, trigger a Wild Magic Surge (Default and can be configured in the Dice Formula options)
- **Incremental Check**: Every time a spell is cast, the threshold is increased by `1` for a Surge. Once triggered the threshold is reset back to `1`.
- **Incremental Check (Chaotic)**: For the amazingly awesome chaotic players and GMs. Instead of increasing every time a spell is cast, at the start of every turn in combat, the threshold is increased by `1` for a Surge to a maximum of `10`. Once triggered the threshold is reset back to `1`.
- **Spell Level Dependent Rolls**: Wild Magic Surge triggers dependent on spell level (Set options below).

[![Whisper chat results to GM](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/settings.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/settings.jpg)

## Whisper chat results to GM

Whisper all message to the GM in case you want to be nice and fudge the rolls.

[![Whisper chat results to GM](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/whisper-chat.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/whisper-chat.jpg)

## Auto Roll a check for Wild Magic Surge instead of just a reminder to roll

The additional option `Auto Roll for a Wild Magic Surge instead of just the prompt` will auto roll in the background for you and post the result in the Chat.

Based on your settings, it will show a prompt that a `Wild Magic Surge` has occured or not.

This message is configurable should you wish.

[![Auto Roll a check for Wild Magic Surge instead of just a reminder to roll](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/auto-roll-check.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/auto-roll-check.jpg)

## Send Incremental Check charge to chat

When enabled, each time a incremental check for a surge changes it is posted to Chat for others to see.

[![Send Incremental Check charge to chat](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/increment-chat.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/increment-chat.jpg)

## Enable Auto Roll on a Wild Magic Surge Table

This option takes things a step further and will roll a Roll Table on a `Wild Magic Surge`.

You can configure a Custom Roll Table by replacing the default name in the settings with your own version.

[![Enable Auto Roll on a Wild Magic Surge Table](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/enable-auto-roll-table.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/enable-auto-roll-table.jpg)

## Execute a GM Macro on a Wild Magic Surge

When a surge happens you can specify your own macro to run. Note this will only trigger a macro setup on the GM user.

Included is a compendium containing examples and the javascript for them are in [/scripts/macros](../scripts/macros/).

[![Execute a GM Macro on a Wild Magic Surge](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/macro-surge.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/macro-surge.jpg)

## Tides of Chaos Recharge

Another option allows you to recharge `Tides of Chaos` automatically on a `Wild Magic Surge`.

[![Tides of Chaos Recharge](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/tides-of-chaos.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/tides-of-chaos.jpg)

## Dice Formula

Set a custom dice formula you want to roll to check for a `Wild Magic Surge`. The default is `1d20`.

[![Dice Formula](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/dice-formula.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/dice-formula.jpg)

## Track Wild Magic Surge for NPCs

Enabling this setting will automate Wild Magic Surge for Non Player Characters as well as Player Characters. Ensure the NPC has the `Wilg Magic Surge` feat.

[![Dice Formula](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/track-npcs.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/track-npcs.jpg)

## The target result of the dice roll

What is the dice roll result you want to check against. The default is `1`.

Can also set multiple target results using a comma seperated value list like `1, 3, 5, 10, 19`

[![The target result of the dice roll](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/target-result-dice-roll.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/target-result-dice-roll.jpg)

## Roll result boolean expression

Based on the target dice roll, should the result be less/greater than or equal to the result to trigger the `Wild Magic Surge`. The default is `=`.

[![Roll result boolean expression](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/roll-result-boolean.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/roll-result-boolean.jpg)

## Auto surge on spell use after Tides of Chaos has been used

When Tides of Chaos is used, any 1st level spell and higher will trigger a surge and restore your Tides of Chaos.

[![Auto surge on spell use after Tides of Chaos has been used](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/auto-surge-toc.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/auto-surge-toc.jpg)

## Setup varying Wild Magic Surge triggers dependent on spell level

Adds the ability to set your own roll evaluation dependent on the spell level used.

For example

- A lvl 1 spell only triggers wild magic if a 1 is rolled on the d20
- A lvl 4 spell triggers if a 4 or lower is rolled
- A lvl 9 triggers if a 9 or lower is rolled

Special thanks to [Jackolas126](https://github.com/Jackolas126) for this suggestion.

[![Setup varying Wild Magic Surge triggers dependent on spell level](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/varying-triggers.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/varying-triggers.jpg)

## Spell Regex for Multiclass spells

The RegEx to differentiate between sorcerer spells and non sorcerer spells. This assumes the sorcerer spells to be renamed like `Magic Missile (S)`. Special characters must be escaped!

Special thanks to [Jakob Huber](https://github.com/gh7531) for this suggestion and Pull Request.

[![Spell Regex for Multiclass spells](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/multiclass-regex.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/multiclass-regex.jpg)

## Play animation on Surge

On a Wild Magic Surge, the token that triggered the Surge will get an animation play. This requires the awesome [https://github.com/fantasycalendar/FoundryVTT-Sequencer](Sequencer) and [https://github.com/Jules-Bens-Aa/JB2A_DnD5e](JB2A) modules to be installed and active.

[![Play animation on Surge](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/play-animation.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/play-animation.jpg)

## Roll for surge on Cantrips

Standard rules are 1st Level and higher to trigger a surge. This also enables it for Cantrips.

[![Roll for surge on Cantrips](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/roll-cantrips.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/roll-cantrips.jpg)

## Encounter Statistics Module Integration

Optionally send Wild Magic Surge event to [Encounter Statistics Module](https://github.com/johnnolan/encounter-stats) to track history of surges in your campaign.

[![Encounter Statistics Module Integration option](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/encounter-statistics.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/encounter-statistics.jpg)

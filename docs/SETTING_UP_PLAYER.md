# Setting up your Player Character to work with this module

To setup your Player Character to work with this module, ensure the following steps are setup. If you want to check the setup, click the `WMS` button in the character sheet header. If it is hidden, enable `Show Debug option in character sheet` in module settings and reload the client.

## Setup Wild Magic Surge Feat

Ensure under the features tab on your character sheet that you have a Feat called `Wild Magic Surge`.

[![Tides of Chaos resource example](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/images/setup/wms_feat.jpg)](https://raw.githubusercontent.com/johnnolan/wild-magic-surge-5e/main/setup/wms_feat.jpg)

## Setup Tides of Chaos

To properly configure Tides of Chaos for your character, follow these steps:

1. Ensure you have the `Tides of Chaos` feature on your character sheet under the Features tab.

2. Configure the `Tides of Chaos` feature to have:
   - Navigate to section `DETAILS`
   - Update group `USAGE` to
     - `MAX`: 1
     - `SPENT`: 0

3. Make sure the feature has a `Use` action/activity that will consume one use when activated.

In dnd5e 6.0.5, `uses.value` is the remaining count and `uses.spent` is the spent count. After using Tides once, these are `0` and `1`; after a recharge, they return to `1` and `0`.

### Sorcerer spell filtering

The module does not inspect a spell's `Source Class`. If you enable the spell-name regex filter, it checks the spell name (for example, `Magic Missile (S)`). Keep `Source Class` accurate for dnd5e, but use the module's name filter to include or exclude spells for Wild Magic.
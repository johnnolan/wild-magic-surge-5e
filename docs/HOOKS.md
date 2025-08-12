# Hooks

I have added in hooks for the following events. This allows other developers or macro users to listen for events from the result of a Wild Magic Surge and add their own custom scripts.


## wild-magic-surge-5e.DieDescendingChanged

Example

```
Hooks.on("wild-magic-surge-5e.DieDescendingChanged", (diceFormula) => {
  console.log('The current dice being rolled is {diceFormula}')
});
```

Runs when you set the module to `Descending Dice` and the dice value changes. Returns `string`.

## wild-magic-surge-5e.IncrementalCheckChanged

Example

```
Hooks.on("wild-magic-surge-5e.IncrementalCheckChanged", (num) => {
  console.log('The current charge value is {num}')
});
```

Runs when you set the module to `Incremental Check` and the increment increases. Returns `integer`.

## wild-magic-surge-5e.CheckForSurge

Example

```
Hooks.on("wild-magic-surge-5e.CheckForSurge", () => {
  console.log('I must prompt to get them to roll a d20!')
});
```

Runs when you set the module to prompt you when a spell is used by a PC with the Wild Magic Feat. Returns `true`.

## wild-magic-surge-5e.IsWildMagicSurge

Example

```
Hooks.on("wild-magic-surge-5e.IsWildMagicSurge", (isWildMagicSurge) => {
  console.log(isWildMagicSurge)
});
```

Runs when you set the module to auto roll a check for you. The result of the roll will trigger this hook and return whether it is a surge and the roll value.


`true` = The PC has triggered a Wild Magic Surge

```
{
  surge: true,
  result: 1,
  tokenId: "4lw0Gp7s0WH5DSil",
}
```

`false` = The PC has not triggered a Wild Magic Surge

```
{
  surge: false,
  result: 12,
  tokenId: "4lw0Gp7s0WH5DSil",
}
```

## wild-magic-surge-5e.Reset

This hook allows you to tell the module to reset the incremental and descending count. Handy for when you want to add homebrew rules like resetting after a long rest.

To get the actor ID

* select the token you want on the map
* Press F12
* In the Console paste `canvas.tokens.controlled[0].data.actorId`
* This is your actorId

In your macro, use the following code replacing the `Owr50jt6HyYru2e1` with the above actorId

`Hooks.callAll("wild-magic-surge-5e.Reset", "Owr50jt6HyYru2e1");`

## Incremental Check Hooks

### wild-magic-surge-5e.ResetIncrementalCheck

This hook allows you to tell the module to reset the incremental count to 1. Handy for when you want to add homebrew rules like resetting after a long rest.

To get the actor ID

* select the token you want on the map
* Press F12
* In the Console paste `canvas.tokens.controlled[0].data.actorId`
* This is your actorId

In your macro, use the following code replacing the `Owr50jt6HyYru2e1` with the above actorId

`Hooks.callAll("wild-magic-surge-5e.ResetIncrementalCheck", "Owr50jt6HyYru2e1");`


## wild-magic-surge-5e.SetIncrementalCheck

This hook allows you to specify which die to use for the incremental count. Handy for when you want to add homebrew rules like increasing or decreasing manually based on a story element or other event.

To get the actor ID

* select the token you want on the map
* Press F12
* In the Console paste `canvas.tokens.controlled[0].data.actorId`
* This is your actorId

In your macro, use the following code replacing the `Owr50jt6HyYru2e1` with the above actorId

The last argument is a value 1-20 which sets what the target roll to trigger should be.

`Hooks.callAll("wild-magic-surge-5e.SetIncrementalCheck", "Owr50jt6HyYru2e1", 1);`

## Die Descending Hooks

### wild-magic-surge-5e.ResetDieDescending

This hook allows you to tell the module to reset the Die Descending count. Handy for when you want to add homebrew rules like resetting after a long rest.

To get the actor ID

* select the token you want on the map
* Press F12
* In the Console paste `canvas.tokens.controlled[0].data.actorId`
* This is your actorId

In your macro, use the following code replacing the `Owr50jt6HyYru2e1` with the above actorId

`Hooks.callAll("wild-magic-surge-5e.ResetDieDescending", "Owr50jt6HyYru2e1");`

### wild-magic-surge-5e.SetDieDescending

This hook allows you to specify which die to use for the Die Descending count. Handy for when you want to add homebrew rules like increasing or decreasing manually based on a story element or other event.

To get the actor ID

* select the token you want on the map
* Press F12
* In the Console paste `canvas.tokens.controlled[0].data.actorId`
* This is your actorId

In your macro, use the following code replacing the `Owr50jt6HyYru2e1` with the above actorId

The 1-6 value in the example specified which dice to switch to.

* 1 = D20
* 2 = D12
* 3 = D10
* 4 = D8
* 5 = D6
* 6 = D4

`Hooks.callAll("wild-magic-surge-5e.SetDieDescending", "Owr50jt6HyYru2e1", 1);`

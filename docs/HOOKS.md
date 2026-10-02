# Hooks

I have added in hooks for the following events. This allows other developers or macro users to listen for events from the result of a Wild Magic Surge and add their own custom scripts.

## wild-magic-surge-5e.manualTriggerWMS

Pass an `Actor` and its evaluated `Roll` to trigger the module's surge check:

```js
Hooks.callAll("wild-magic-surge-5e.manualTriggerWMS", actor, roll);
```

## wild-magic-surge-5e.DieDescendingChanged

Receives the updated resource value when the die-descending value changes:

```js
Hooks.on("wild-magic-surge-5e.DieDescendingChanged", (resource) => {
  console.log(resource.value);
});
```

The payload has `label`, `lr`, `sr`, `max`, and `value` fields.

## wild-magic-surge-5e.IncrementalCheckChanged

Receives the new target number for the incremental check:

```js
Hooks.on("wild-magic-surge-5e.IncrementalCheckChanged", ({ value }) => {
  console.log(value);
});
```

Runs when you set the module to `Incremental Check` and the increment increases. The payload shape is `{ value: number }`.

## wild-magic-surge-5e.CheckForSurge

Emits `{ value: true }` when a spell is used by a PC with the Wild Magic Feat and the module is configured to prompt:

```js
Hooks.on("wild-magic-surge-5e.CheckForSurge", ({ value }) => {
  if (value) console.log("Prompt for a Wild Magic Surge roll");
});
```

## wild-magic-surge-5e.IsWildMagicSurge

Receives the surge result and its associated roll and actor/token identifiers:

```js
Hooks.on("wild-magic-surge-5e.IsWildMagicSurge", (result) => {
  console.log(result.surge, result.result, result.actorId, result.tokenId);
});
```

`result` has type `string | undefined`, `tokenId` has type `string | undefined`, and `actorId` has type `string | null`.

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

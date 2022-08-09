import { MODULE_ID } from "../Settings.js";

export function SettingsList(settings: any) {
  let chatSettingsList = [];

  for (const element of settings) {
    const setting = element;

    // @ts-expect-error TS(2304): Cannot find name 'game'.
    for (const [key, value] of game.settings.settings.entries()) {
      if (key === `${MODULE_ID}.${setting}`) {
        // @ts-expect-error TS(2304): Cannot find name 'game'.
        const settingValue = game.settings.get(MODULE_ID, setting);

        let choicesSelect = [];
        let isArray = false;
        if (value.choices) {
          isArray = true;
          for (const keyChoice in value.choices) {
            choicesSelect.push({
              key: keyChoice.toString(),
              value: value.choices[keyChoice],
              selected: keyChoice.toString() === settingValue,
            });
          }
        }

        chatSettingsList.push({
          module: value.namespace ? value.namespace : value.module,
          key: value.key,
          type: value.type.name,
          isBoolean: value.type.name === "Boolean",
          isString: value.type.name === "String" && !value.choices,
          isArray: isArray,
          // @ts-expect-error TS(2304): Cannot find name 'game'.
          displayname: game.i18n.format(value.name),
          // @ts-expect-error TS(2304): Cannot find name 'game'.
          hint: value.hint ? game.i18n.format(value.hint) : "",
          choices: value.choices ? value.choices : [],
          value: settingValue,
          choicesSelect: choicesSelect,
        });
      }
    }
  }

  return chatSettingsList;
}

export function UpdateObject(formData: any) {
  for (const key in formData) {
    const keySplit = key.split(".");
    // @ts-expect-error TS(2304): Cannot find name 'game'.
    game.settings.set(keySplit[0], keySplit[1], formData[key]);
  }
}

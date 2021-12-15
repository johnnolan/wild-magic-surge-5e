import { MODULE_ID } from "../Settings.js";

export function SettingsList(settings) {
  let chatSettingsList = [];

  for (let i = 0; i < settings.length; i++) {
    const setting = settings[i];

    for (const [key, value] of game.settings.settings.entries()) {
      if (key === `${MODULE_ID}.${setting}`) {
        const settingValue = game.settings.get(MODULE_ID, setting);

        let choicesSelect = [];
        let isArray = false;
        if (value.choices) {
          isArray = true;
          for (const key in value.choices) {
            choicesSelect.push({
              key: key.toString(),
              value: value.choices[key],
              selected: key.toString() === settingValue,
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
          displayname: game.i18n.format(value.name),
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

export function UpdateObject(formData) {
  for (const key in formData) {
    const keySplit = key.split(".");
    game.settings.set(keySplit[0], keySplit[1], formData[key]);
  }
}

import { test, expect } from "./fixtures";
import {
  getReminderMessage,
  openChatSettingsPanel,
  setReminderMessage,
} from "./foundry";

test("saves a reminder message from Chat Message Options", async ({
  gmPage,
}) => {
  const originalMessage = await getReminderMessage(gmPage);
  const newMessage = `Browser test reminder ${Date.now()}`;
  const messageField = gmPage.getByLabel("Message to check for surge");

  try {
    await openChatSettingsPanel(gmPage);
    await messageField.fill(newMessage);
    await gmPage.getByRole("button", { name: "Save Changes" }).click();

    await expect.poll(() => getReminderMessage(gmPage)).toBe(newMessage);
    await openChatSettingsPanel(gmPage);
    await expect(messageField).toHaveValue(newMessage);
  } finally {
    await setReminderMessage(gmPage, originalMessage);
  }
});

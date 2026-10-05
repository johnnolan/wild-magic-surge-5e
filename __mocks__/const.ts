import { setTestGlobal } from "../scripts/test/FoundryFixtures";
setTestGlobal("CONST", {
  CHAT_MESSAGE_TYPES: {
    WHISPER: "WHISPER",
    ROLL: "ROLL",
  },
});

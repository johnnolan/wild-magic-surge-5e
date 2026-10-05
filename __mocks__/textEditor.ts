import { setTestGlobal } from "../scripts/test/FoundryFixtures";
setTestGlobal("TextEditor", {
  enrichHTML: jest.fn().mockResolvedValue("Test Description"),
});

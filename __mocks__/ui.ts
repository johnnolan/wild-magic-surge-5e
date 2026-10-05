import { setTestUi } from "../scripts/test/FoundryFixtures";
setTestUi({
  notifications: {
    info: jest.fn(),
  }
});

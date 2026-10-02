import { setTestGlobal } from "../scripts/test/FoundryFixtures";
setTestGlobal("CONFIG", {
  RollTable: {
    resultTemplate: "<div>test</div>",
  },
});

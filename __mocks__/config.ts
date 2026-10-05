import { setTestGlobal } from "../scripts/test/FoundryFixtures";
setTestGlobal("CONFIG", {
  ChatMessage: {
    modes: { public: {}, gm: {}, blind: {}, self: {}, ic: {} },
  },
  RollTable: {
    resultTemplate: "<div>test</div>",
  },
});

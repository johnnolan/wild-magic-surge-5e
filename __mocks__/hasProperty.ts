import { setTestGlobal } from "../scripts/test/FoundryFixtures";

setTestGlobal("hasProperty", jest.fn().mockReturnValue(true));

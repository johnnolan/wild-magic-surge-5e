import {
  GetDnd5eActorLevel,
  GetDnd5eResource,
  GetDnd5eSpellLevel,
  GetDnd5eUses,
  IsDnd5eActorSubtype,
  IsDnd5eItemSubtype,
  ParseDnd5eResource,
} from "./Dnd5eSystem";

describe("D&D5E system data accessors", () => {
  describe("spell level", () => {
    it.each([
      undefined,
      null,
      {},
      { level: "3" },
      { level: -1 },
      { level: 10 },
    ])("rejects absent or invalid spell level data: %p", (system) => {
      expect(GetDnd5eSpellLevel(system)).toBeUndefined();
    });

    it("returns a valid spell level", () => {
      expect(GetDnd5eSpellLevel({ level: 3 })).toBe(3);
    });
  });

  describe("actor level", () => {
    it.each([undefined, {}, { details: null }, { details: { level: "8" } }])(
      "rejects absent or invalid actor level data: %p",
      (system) => {
        expect(GetDnd5eActorLevel(system)).toBeUndefined();
      },
    );

    it("returns a valid actor level", () => {
      expect(GetDnd5eActorLevel({ details: { level: 8 } })).toBe(8);
    });
  });

  describe("resource slots", () => {
    it.each([
      undefined,
      {},
      { resources: null },
      { resources: { primary: { value: "1", max: 6 } } },
    ])("rejects absent or invalid resource data: %p", (system) => {
      expect(GetDnd5eResource(system, "primary")).toBeUndefined();
    });

    it("returns a valid resource slot", () => {
      expect(
        GetDnd5eResource(
          {
            resources: {
              primary: {
                label: "Surge",
                value: 2,
                max: 6,
                lr: true,
                sr: false,
              },
            },
          },
          "primary",
        ),
      ).toEqual({ label: "Surge", value: 2, max: 6, lr: true, sr: false });
    });

    it("normalizes optional descriptive resource fields", () => {
      expect(ParseDnd5eResource({ value: 1, max: 20 })).toEqual({
        label: "Surge Chance",
        value: 1,
        max: 20,
        lr: false,
        sr: false,
      });
    });
  });

  describe("uses", () => {
    it.each([undefined, {}, { uses: null }, { uses: { value: "0" } }])(
      "rejects absent or invalid uses data: %p",
      (system) => {
        expect(GetDnd5eUses(system)).toBeUndefined();
      },
    );

    it("returns valid uses fields", () => {
      expect(GetDnd5eUses({ uses: { value: 0, max: 1, spent: 1 } })).toEqual({
        value: 0,
        max: 1,
        spent: 1,
      });
    });
  });

  it("checks recognized Item and Actor subtypes", () => {
    expect(IsDnd5eItemSubtype({ type: "spell" }, "spell")).toBe(true);
    expect(IsDnd5eItemSubtype({ type: "weapon" }, "spell")).toBe(false);
    expect(IsDnd5eActorSubtype({ type: "npc" }, "npc")).toBe(true);
    expect(IsDnd5eActorSubtype(undefined, "npc")).toBe(false);
  });
});

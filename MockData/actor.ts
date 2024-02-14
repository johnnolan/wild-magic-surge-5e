export const actor: Actor = {
  getFlag: jest.fn().mockResolvedValue({
    max: 20,
    min: 1,
    value: 1,
  }),
  setFlag: jest.fn().mockResolvedValue(2),
  update: jest.fn().mockResolvedValue(true),
  system: {
    details: {
      level: 14,
    },
  },
  id: "eMyoELkOwFNPGEK8",
  name: "Graa S'oua",
  type: "character",
  img: "dndbeyond/Graa-S-oua.jpeg",
  sheet: {
    token: {
      id: "rMyoELkOwFNPGEK4",
    },
  },
  items: [
    {
      _id: "PkEkb6E3XgG0oPDB",
      name: "Sorcerer",
      type: "class",
      img: "systems/dnd5e/icons/skills/fire_08.jpg",
      data: {
        source: "Basic Rules pg 99, Player's Handbook pg 103",
        levels: 7,
        subclass: "Wild Magic",
        hitDice: "d6",
        hitDiceUsed: 0,
        saves: ["con", "cha"],
        skills: {
          number: 2,
          choices: ["arc", "dec", "ins", "itm", "per", "rel"],
          value: ["dec", "per"],
        },
        spellcasting: {
          progression: "full",
          ability: "cha",
        },
      },
      effects: [],
      folder: null,
      sort: 0,
      permission: {
        default: 0,
        IZeL6p5JYBJ2JeAd: 3,
      },
      flags: {
        ddbimporter: {
          id: 58433955,
          definitionId: 6,
          entityTypeId: 1446578651,
        },
      },
    },
    {
      _id: "iGoR4ePl1mTZFAAM",
      name: "Wild Magic Surge",
      type: "feat",
      img: "systems/dnd5e/icons/spells/lightning-magenta-3.jpg",
      data: {
        source: "Sorcerer : Wild Magic",
        activation: {
          type: "",
          cost: 0,
          condition: "",
        },
        duration: {
          value: null,
          units: "",
        },
        target: {
          value: null,
          width: null,
          units: "",
          type: "",
        },
        range: {
          value: null,
          long: null,
          units: "",
        },
        uses: {
          value: 0,
          max: 0,
          per: null,
        },
        consume: {
          type: "",
          target: null,
          amount: null,
        },
        ability: null,
        actionType: null,
        attackBonus: 0,
        chatFlavor: "",
        critical: null,
        damage: {
          parts: [],
          versatile: "",
        },
        formula: "",
        save: {
          ability: "",
          dc: null,
          scaling: "spell",
        },
        requirements: "",
        recharge: {
          value: null,
          charged: false,
        },
      },
      effects: [],
      folder: null,
      sort: 0,
      permission: {
        default: 0,
        IZeL6p5JYBJ2JeAd: 3,
      },
      flags: {
        ddbimporter: {
          id: 381,
          dndbeyond: {
            requiredLevel: 1,
            displayOrder: 1,
            levelScale: null,
            levelScales: [],
            limitedUse: [],
            class: "Sorcerer : Wild Magic",
          },
        },
      },
    },
  ],
  flags: {
    "wild-magic-surge-5e": {
      surge_increment: {
        max: 20,
        min: 1,
        value: 1,
      },
    },
  },
};

import MagicSurgeCheck from "./MagicSurgeCheck.js";
import IncrementalCheck from "./utils/IncrementalCheck.js";
import SpellLevelTrigger from "./utils/SpellLevelTrigger.js";
import { actor } from "../MockData/actor.js";
import { chatMessage, chatMessageNoSpell } from "../MockData/chatMessage.js";

jest.mock("./utils/SpellLevelTrigger.js");
jest.mock("./utils/IncrementalCheck.js");

describe("Check", () => {
  describe("Has no actor", () => {
    let magicSurgeCheck;
    beforeEach(() => {
      magicSurgeCheck = new MagicSurgeCheck();
      global.game = {
        actors: {
          get: jest.fn().mockReturnValue(undefined),
        },
      };
    });
    it("It returns from module", async () => {
      const result = await magicSurgeCheck.Check(chatMessage);
      expect(result).toBeFalsy();
    });
  });
  describe("OPT_AUTO_D20 is true", () => {
    describe("Has no Wild Magic Feat", () => {
      let magicSurgeCheck;
      beforeEach(() => {
        magicSurgeCheck = new MagicSurgeCheck();
        jest.spyOn(magicSurgeCheck, "RunMessageCheck").mockReturnValue(true);
        jest.spyOn(magicSurgeCheck, "RunAutoCheck").mockReturnValue(true);
        global.Hooks = {
          callAll: jest.fn().mockReturnValue(true),
        };
        global.game = {
          actors: {
            get: jest.fn().mockReturnValue({
              data: {
                items: [
                  {
                    id: "WWb4vAmh18sMAxfY",
                    data: {
                      name: "Flame Tongue Greatsword",
                      data: { actionType: "mwak" },
                    },
                    token: {
                      _id: "5H4YnyD6zf9vcJ3Q",
                    },
                  },
                ],
              },
            }),
          },
          user: {
            id: "123",
            isGM: true,
          },
          settings: {
            get: jest.fn().mockReturnValue(true),
          },
        };
      });
      it("It returns from module", async () => {
        const result = await magicSurgeCheck.Check(chatMessageNoSpell);
        expect(magicSurgeCheck.RunMessageCheck).not.toBeCalled();
        expect(magicSurgeCheck.RunMessageCheck).toHaveBeenCalledTimes(0);
        expect(magicSurgeCheck.RunAutoCheck).not.toBeCalled();
        expect(magicSurgeCheck.RunAutoCheck).toHaveBeenCalledTimes(0);
      });
    });

    describe("Has Wild Magic Feat", () => {
      let magicSurgeCheck;
      beforeEach(() => {
        magicSurgeCheck = new MagicSurgeCheck();
        jest.spyOn(magicSurgeCheck, "RunMessageCheck").mockReturnValue(true);
        jest.spyOn(magicSurgeCheck, "RunAutoCheck").mockReturnValue(true);
        jest
          .spyOn(magicSurgeCheck, "WildMagicSurgeRollCheck")
          .mockReturnValue(true);
        global.Hooks = {
          callAll: jest.fn().mockReturnValue(),
        };
        global.game = {
          actors: {
            get: jest.fn().mockReturnValue({
              data: {
                items: [
                  {
                    id: "WWb4vAmh18sMAxfY",
                    data: {
                      name: "Flame Tongue Greatsword",
                      data: { actionType: "mwak" },
                    },
                    token: {
                      _id: "5H4YnyD6zf9vcJ3Q",
                    },
                  },
                  {
                    _id: "iGoR4ePl1mTZFAAM",
                    name: "Wild Magic Surge",
                    type: "feat",
                    img: "systems/dnd5e/icons/spells/lightning-magenta-3.jpg",
                    data: {
                      description: {
                        value:
                          '<p class="compendium-hr">Starting when you choose this origin at 1st level, your spellcasting can unleash surges of untamed magic. Once per turn, the DM can have you roll a d20 immediately after you cast a sorcerer spell of 1st level or higher. If you roll a 1, roll on the Wild Magic Surge table to create a magical effect. If that effect is a spell, it is too wild to be affected by your Metamagic, and if it normally requires concentration, it doesn’t require concentration in this case; the spell lasts for its full duration.</p>\n<h5 class="Table-Styles_Table-Title">Wild Magic Surge</h5>\n<table id="table016" class="Table TableOverride-1">\n<thead>\n<tr class="Table _idGenTableRowColumn-3">\n<th class="Table Table-Header">\n<p class="Table-Styles_Header--for-Table-Cell-Style- ParaOverride-3"><strong>d100</strong></p>\n</th>\n<th class="Table Table-Header _idGenCellOverride-1">\n<p class="Table-Styles_Header--for-Table-Cell-Style-"><strong>Effect</strong></p>\n</th>\n</tr>\n</thead>\n<tbody>\n<tr class="Table _idGenTableRowColumn-25">\n<td class="Table Table-Body _idGenCellOverride-2">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">01–02</p>\n</td>\n<td class="Table Table-Body _idGenCellOverride-2">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Roll on this table at the start of each of your turns for the next minute, ignoring this result on subsequent rolls.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">03–04</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">For the next minute, you can see any invisible creature if you have line of sight to it.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-25">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">05–06</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">A modron chosen and controlled by the DM appears in an unoccupied space within 5 feet of you, then disappears 1 minute later.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">07–08</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You cast <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">fireball</span> as a 3rd-level spell centered on yourself.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-4">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">09–10</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You cast <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">magic missile</span> as a 5th-level spell.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-26">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">11–12</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Roll a d10. Your height changes by a number of inches equal to the roll. If the roll is odd, you shrink. If the roll is even, you grow.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-4">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">13–14</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You cast <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">confusion</span> centered on yourself.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">15–16</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">For the next minute, you regain 5 hit points at the start of each of your turns.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-25">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">17–18</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You grow a long beard made of feathers that remains until you sneeze, at which point the feathers explode out from your face.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-5">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">19–20</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You cast <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">grease</span> centered on yourself.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-25">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">21–22</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Creatures have disadvantage on saving throws against the next spell you cast in the next minute that involves a saving throw.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">23–24</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Your skin turns a vibrant shade of blue. A <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">remove curse</span> spell can end this effect.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-25">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">25–26</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">An eye appears on your forehead for the next minute. During that time, you have advantage on Wisdom (Perception) checks that rely on sight.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">27–28</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">For the next minute, all your spells with a casting time of 1 action have a casting time of 1 bonus action.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-27">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">29–30</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You teleport up to 60 feet to an unoccupied space of your choice that you can see.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-28">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">31–32</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You are transported to the Astral Plane until the end of your next turn, after which time you return to the space you previously occupied or the nearest unoccupied space if that space is occupied.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-27">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">33–34</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Maximize the damage of the next damaging spell you cast within the next minute.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-26">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">35–36</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Roll a d10. Your age changes by a number of years equal to the roll. If the roll is odd, you get younger (minimum 1 year old). If the roll is even, you get older.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-25">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">37–38</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">1d6 flumphs controlled by the DM appear in unoccupied spaces within 60 feet of you and are frightened of you. They vanish after 1 minute.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-5">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">39–40</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You regain 2d10 hit points.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-29">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">41–42</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You turn into a potted plant until the start of your next turn. While a plant, you are incapacitated and have vulnerability to all damage. If you drop to 0 hit points, your pot breaks, and your form reverts.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">43–44</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">For the next minute, you can teleport up to 20 feet as a bonus action on each of your turns.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-4">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">45–46</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You cast <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">levitate</span> on yourself.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">47–48</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">A unicorn controlled by the DM appears in a space within 5 feet of you, then disappears 1 minute later.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-27">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">49–50</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You can’t speak for the next minute. Whenever you try, pink bubbles float out of your mouth.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-26">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">51–52</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">A spectral shield hovers near you for the next minute, granting you a +2 bonus to AC and immunity to <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">magic missile.</span></p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-27">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">53–54</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You are immune to being intoxicated by alcohol for the next 5d6 days.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-5">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">55–56</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Your hair falls out but grows back within 24 hours.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-25">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">57–58</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">For the next minute, any flammable object you touch that isn’t being worn or carried by another creature bursts into flame.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-5">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">59–60</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You regain your lowest-level expended spell slot.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-4">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">61–62</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">For the next minute, you must shout when you speak.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-5">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">63–64</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You cast <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">fog cloud</span> centered on yourself.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-27">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">65–66</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Up to three creatures you choose within 30 feet of you take 4d10 lightning damage.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">67–68</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You are frightened by the nearest creature until the end of your next turn.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-25">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">69–70</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Each creature within 30 feet of you becomes invisible for the next minute. The invisibility ends on a creature when it attacks or casts a spell.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-5">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">71–72</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You gain resistance to all damage for the next minute.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-27">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">73–74</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">A random creature within 60 feet of you becomes poisoned for 1d4 hours.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-26">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">75–76</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You glow with bright light in a 30-foot radius for the next minute. Any creature that ends its turn within 5 feet of you is blinded until the end of its next turn.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-27">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">77–78</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You cast <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">polymorph</span> on yourself. If you fail the saving throw, you turn into a sheep for the spell’s duration.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">79–80</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Illusory butterflies and flower petals flutter in the air within 10 feet of you for the next minute.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-4">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">81–82</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You can take one additional action immediately.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-26">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">83–84</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Each creature within 30 feet of you takes 1d10 necrotic damage. You regain hit points equal to the sum of the necrotic damage dealt.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-4">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">85–86</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You cast <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">mirror image.</span></p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-5">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">87–88</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You cast <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">fly</span> on a random creature within 60 feet of you.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-25">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">89–90</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You become invisible for the next minute. During that time, other creatures can’t hear you. The invisibility ends if you attack or cast a spell.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">91–92</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">If you die within the next minute, you immediately come back to life as if by the <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">reincarnate</span> spell.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-27">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">93–94</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Your size increases by one size category for the next minute.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">95–96</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You and all creatures within 30 feet of you gain vulnerability to piercing damage for the next minute.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-27">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">97–98</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You are surrounded by faint, ethereal music for the next minute.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-5">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">99–00</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You regain all expended sorcery points.</p>\n</td>\n</tr>\n</tbody>\n</table>',
                        chat: "",
                        unidentified: "",
                      },
                      source: "Sorcerer : Wild Magic",
                    },
                  },
                ],
              },
            }),
          },
          user: {
            id: "123",
            isGM: true,
          },
          settings: {
            get: jest.fn().mockReturnValue(true),
          },
        };
      });
      it("It auto checks", async () => {
        const result = await magicSurgeCheck.Check(chatMessage);
        expect(magicSurgeCheck.RunMessageCheck).not.toBeCalled();
        expect(magicSurgeCheck.RunMessageCheck).toHaveBeenCalledTimes(0);
        expect(magicSurgeCheck.WildMagicSurgeRollCheck).not.toBeCalled();
        expect(magicSurgeCheck.WildMagicSurgeRollCheck).toHaveBeenCalledTimes(
          0
        );
      });
    });
  });
  describe("OPT_AUTO_D20 is false", () => {
    describe("Has Wild Magic Feat", () => {
      let magicSurgeCheck;
      beforeEach(() => {
        magicSurgeCheck = new MagicSurgeCheck();
        jest.spyOn(magicSurgeCheck, "RunMessageCheck").mockReturnValue(true);
        global.game = {
          actors: {
            get: jest.fn().mockReturnValue({
              data: {
                items: [
                  {
                    id: "WWb4vAmh18sMAxfY",
                    data: {
                      name: "Flame Tongue Greatsword",
                      data: { actionType: "mwak" },
                    },
                    token: {
                      _id: "5H4YnyD6zf9vcJ3Q",
                    },
                  },
                  {
                    _id: "iGoR4ePl1mTZFAAM",
                    name: "Wild Magic Surge",
                    type: "feat",
                    img: "systems/dnd5e/icons/spells/lightning-magenta-3.jpg",
                    data: {
                      description: {
                        value:
                          '<p class="compendium-hr">Starting when you choose this origin at 1st level, your spellcasting can unleash surges of untamed magic. Once per turn, the DM can have you roll a d20 immediately after you cast a sorcerer spell of 1st level or higher. If you roll a 1, roll on the Wild Magic Surge table to create a magical effect. If that effect is a spell, it is too wild to be affected by your Metamagic, and if it normally requires concentration, it doesn’t require concentration in this case; the spell lasts for its full duration.</p>\n<h5 class="Table-Styles_Table-Title">Wild Magic Surge</h5>\n<table id="table016" class="Table TableOverride-1">\n<thead>\n<tr class="Table _idGenTableRowColumn-3">\n<th class="Table Table-Header">\n<p class="Table-Styles_Header--for-Table-Cell-Style- ParaOverride-3"><strong>d100</strong></p>\n</th>\n<th class="Table Table-Header _idGenCellOverride-1">\n<p class="Table-Styles_Header--for-Table-Cell-Style-"><strong>Effect</strong></p>\n</th>\n</tr>\n</thead>\n<tbody>\n<tr class="Table _idGenTableRowColumn-25">\n<td class="Table Table-Body _idGenCellOverride-2">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">01–02</p>\n</td>\n<td class="Table Table-Body _idGenCellOverride-2">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Roll on this table at the start of each of your turns for the next minute, ignoring this result on subsequent rolls.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">03–04</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">For the next minute, you can see any invisible creature if you have line of sight to it.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-25">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">05–06</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">A modron chosen and controlled by the DM appears in an unoccupied space within 5 feet of you, then disappears 1 minute later.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">07–08</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You cast <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">fireball</span> as a 3rd-level spell centered on yourself.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-4">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">09–10</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You cast <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">magic missile</span> as a 5th-level spell.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-26">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">11–12</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Roll a d10. Your height changes by a number of inches equal to the roll. If the roll is odd, you shrink. If the roll is even, you grow.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-4">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">13–14</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You cast <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">confusion</span> centered on yourself.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">15–16</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">For the next minute, you regain 5 hit points at the start of each of your turns.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-25">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">17–18</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You grow a long beard made of feathers that remains until you sneeze, at which point the feathers explode out from your face.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-5">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">19–20</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You cast <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">grease</span> centered on yourself.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-25">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">21–22</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Creatures have disadvantage on saving throws against the next spell you cast in the next minute that involves a saving throw.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">23–24</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Your skin turns a vibrant shade of blue. A <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">remove curse</span> spell can end this effect.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-25">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">25–26</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">An eye appears on your forehead for the next minute. During that time, you have advantage on Wisdom (Perception) checks that rely on sight.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">27–28</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">For the next minute, all your spells with a casting time of 1 action have a casting time of 1 bonus action.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-27">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">29–30</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You teleport up to 60 feet to an unoccupied space of your choice that you can see.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-28">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">31–32</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You are transported to the Astral Plane until the end of your next turn, after which time you return to the space you previously occupied or the nearest unoccupied space if that space is occupied.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-27">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">33–34</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Maximize the damage of the next damaging spell you cast within the next minute.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-26">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">35–36</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Roll a d10. Your age changes by a number of years equal to the roll. If the roll is odd, you get younger (minimum 1 year old). If the roll is even, you get older.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-25">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">37–38</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">1d6 flumphs controlled by the DM appear in unoccupied spaces within 60 feet of you and are frightened of you. They vanish after 1 minute.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-5">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">39–40</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You regain 2d10 hit points.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-29">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">41–42</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You turn into a potted plant until the start of your next turn. While a plant, you are incapacitated and have vulnerability to all damage. If you drop to 0 hit points, your pot breaks, and your form reverts.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">43–44</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">For the next minute, you can teleport up to 20 feet as a bonus action on each of your turns.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-4">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">45–46</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You cast <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">levitate</span> on yourself.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">47–48</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">A unicorn controlled by the DM appears in a space within 5 feet of you, then disappears 1 minute later.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-27">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">49–50</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You can’t speak for the next minute. Whenever you try, pink bubbles float out of your mouth.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-26">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">51–52</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">A spectral shield hovers near you for the next minute, granting you a +2 bonus to AC and immunity to <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">magic missile.</span></p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-27">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">53–54</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You are immune to being intoxicated by alcohol for the next 5d6 days.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-5">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">55–56</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Your hair falls out but grows back within 24 hours.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-25">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">57–58</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">For the next minute, any flammable object you touch that isn’t being worn or carried by another creature bursts into flame.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-5">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">59–60</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You regain your lowest-level expended spell slot.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-4">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">61–62</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">For the next minute, you must shout when you speak.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-5">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">63–64</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You cast <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">fog cloud</span> centered on yourself.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-27">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">65–66</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Up to three creatures you choose within 30 feet of you take 4d10 lightning damage.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">67–68</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You are frightened by the nearest creature until the end of your next turn.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-25">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">69–70</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Each creature within 30 feet of you becomes invisible for the next minute. The invisibility ends on a creature when it attacks or casts a spell.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-5">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">71–72</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You gain resistance to all damage for the next minute.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-27">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">73–74</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">A random creature within 60 feet of you becomes poisoned for 1d4 hours.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-26">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">75–76</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You glow with bright light in a 30-foot radius for the next minute. Any creature that ends its turn within 5 feet of you is blinded until the end of its next turn.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-27">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">77–78</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You cast <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">polymorph</span> on yourself. If you fail the saving throw, you turn into a sheep for the spell’s duration.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">79–80</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Illusory butterflies and flower petals flutter in the air within 10 feet of you for the next minute.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-4">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">81–82</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You can take one additional action immediately.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-26">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">83–84</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Each creature within 30 feet of you takes 1d10 necrotic damage. You regain hit points equal to the sum of the necrotic damage dealt.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-4">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">85–86</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You cast <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">mirror image.</span></p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-5">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">87–88</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You cast <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">fly</span> on a random creature within 60 feet of you.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-25">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">89–90</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You become invisible for the next minute. During that time, other creatures can’t hear you. The invisibility ends if you attack or cast a spell.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">91–92</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">If you die within the next minute, you immediately come back to life as if by the <span class="Sans-Serif-Character-Styles_Italic-Sans-Serif">reincarnate</span> spell.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-27">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">93–94</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">Your size increases by one size category for the next minute.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-20">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">95–96</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You and all creatures within 30 feet of you gain vulnerability to piercing damage for the next minute.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-27">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">97–98</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You are surrounded by faint, ethereal music for the next minute.</p>\n</td>\n</tr>\n<tr class="Table _idGenTableRowColumn-5">\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style- ParaOverride-3">99–00</p>\n</td>\n<td class="Table Table-Body">\n<p class="Table-Styles_Table-Body--for-Table-Cell-Style-" style="text-align:left">You regain all expended sorcery points.</p>\n</td>\n</tr>\n</tbody>\n</table>',
                        chat: "",
                        unidentified: "",
                      },
                      source: "Sorcerer : Wild Magic",
                    },
                  },
                ],
              },
            }),
          },
          user: {
            id: "123",
            isGM: true,
          },
          settings: {
            get: jest.fn().mockReturnValue(false),
          },
        };
      });
      it("It Sends a message", async () => {
        const result = await magicSurgeCheck.Check(chatMessage);
        expect(magicSurgeCheck.RunMessageCheck).toBeCalled();
        expect(magicSurgeCheck.RunMessageCheck).toHaveBeenCalledTimes(1);
      });
    });
  });
});

describe("resultCheck", () => {
  describe("has 1 value in the result check", () => {
    let magicSurgeCheck;
    beforeAll(() => {
      magicSurgeCheck = new MagicSurgeCheck();
      global.game = {
        actors: actor,
        settings: {
          get: jest.fn().mockReturnValue("2"),
        },
      };
    });
    test("roll of 2 EQ 2", async () => {
      const result = await magicSurgeCheck.ResultCheck(2, "EQ");
      expect(result).toBeTruthy();
    });
    test("roll of 2 Not EQ 2", async () => {
      const result = await magicSurgeCheck.ResultCheck(1, "EQ");
      expect(result).toBeFalsy();
    });
    test("roll of 2 Not GT 2", async () => {
      const result = await magicSurgeCheck.ResultCheck(2, "GT");
      expect(result).toBeFalsy();
    });
    test("roll of 3 GT 2", async () => {
      const result = await magicSurgeCheck.ResultCheck(3, "GT");
      expect(result).toBeTruthy();
    });
    test("roll of 2 Not LT 2", async () => {
      const result = await magicSurgeCheck.ResultCheck(2, "LT");
      expect(result).toBeFalsy();
    });
    test("roll of 1 LT 2", async () => {
      const result = await magicSurgeCheck.ResultCheck(1, "LT");
      expect(result).toBeTruthy();
    });
  });

  describe("has 2 values in the result check", () => {
    let magicSurgeCheck;
    beforeAll(() => {
      magicSurgeCheck = new MagicSurgeCheck();
      global.game = {
        actors: actor,
        settings: {
          get: jest.fn().mockReturnValue("2, 4"),
        },
      };
    });
    test("roll of 2 EQ 2", async () => {
      const result = await magicSurgeCheck.ResultCheck(2, "EQ");
      expect(result).toBeTruthy();
    });
    test("roll of 4 EQ 4", async () => {
      const result = await magicSurgeCheck.ResultCheck(4, "EQ");
      expect(result).toBeTruthy();
    });
    test("roll of 2 Not EQ 2", async () => {
      const result = await magicSurgeCheck.ResultCheck(1, "EQ");
      expect(result).toBeFalsy();
    });
    test("roll of 2 Not GT 2", async () => {
      const result = await magicSurgeCheck.ResultCheck(2, "GT");
      expect(result).toBeFalsy();
    });
    test("roll of 3 GT 2", async () => {
      const result = await magicSurgeCheck.ResultCheck(3, "GT");
      expect(result).toBeTruthy();
    });
    test("roll of 2 Not LT 2", async () => {
      const result = await magicSurgeCheck.ResultCheck(2, "LT");
      expect(result).toBeTruthy();
    });
    test("roll of 1 LT 2", async () => {
      const result = await magicSurgeCheck.ResultCheck(1, "LT");
      expect(result).toBeTruthy();
    });
  });
});

describe("RunAutoCheck", () => {
  let resultCheckSpy;
  let magicSurgeCheck;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    magicSurgeCheck = new MagicSurgeCheck();
    resultCheckSpy = jest.spyOn(magicSurgeCheck, "ResultCheck");
    jest
      .spyOn(magicSurgeCheck, "WildMagicSurgeRollCheck")
      .mockReturnValue(true);
    global.Hooks = {
      callAll: jest.fn().mockReturnValue(),
    };
  });
  test("INVALID_OPTION", async () => {
    await magicSurgeCheck.RunAutoCheck(actor, 1, "INVALID_OPTION");
    expect(resultCheckSpy).not.toBeCalled();
    expect(resultCheckSpy).toHaveBeenCalledTimes(0);
    expect(IncrementalCheck).not.toBeCalled();
    expect(IncrementalCheck).toHaveBeenCalledTimes(0);
    expect(SpellLevelTrigger).not.toBeCalled();
    expect(SpellLevelTrigger).toHaveBeenCalledTimes(0);
    expect(global.Hooks.callAll).not.toBeCalled();
    expect(global.Hooks.callAll).toHaveBeenCalledTimes(0);
  });
  test("DEFAULT", async () => {
    await magicSurgeCheck.RunAutoCheck(actor, 1, "DEFAULT");
    expect(resultCheckSpy).toBeCalled();
    expect(resultCheckSpy).toHaveBeenCalledTimes(1);
    expect(IncrementalCheck).not.toBeCalled();
    expect(IncrementalCheck).toHaveBeenCalledTimes(0);
    expect(SpellLevelTrigger).not.toBeCalled();
    expect(SpellLevelTrigger).toHaveBeenCalledTimes(0);
    expect(global.Hooks.callAll).toBeCalled();
    expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
  });
  test("INCREMENTAL_CHECK", async () => {
    await magicSurgeCheck.RunAutoCheck(actor, 1, "INCREMENTAL_CHECK");
    expect(IncrementalCheck).toBeCalled();
    expect(IncrementalCheck).toHaveBeenCalledTimes(1);
    expect(resultCheckSpy).not.toBeCalled();
    expect(resultCheckSpy).toHaveBeenCalledTimes(0);
    expect(SpellLevelTrigger).not.toBeCalled();
    expect(SpellLevelTrigger).toHaveBeenCalledTimes(0);
    expect(global.Hooks.callAll).toBeCalled();
    expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
  });
  test("SPELL_LEVEL_DEPENDENT_ROLL", async () => {
    await magicSurgeCheck.RunAutoCheck(actor, 1, "SPELL_LEVEL_DEPENDENT_ROLL");
    expect(resultCheckSpy).not.toBeCalled();
    expect(resultCheckSpy).toHaveBeenCalledTimes(0);
    expect(SpellLevelTrigger).toBeCalled();
    expect(SpellLevelTrigger).toHaveBeenCalledTimes(1);
    expect(IncrementalCheck).not.toBeCalled();
    expect(IncrementalCheck).toHaveBeenCalledTimes(0);
    expect(global.Hooks.callAll).toBeCalled();
    expect(global.Hooks.callAll).toHaveBeenCalledTimes(1);
  });
  afterEach(() => {
    resultCheckSpy.mockRestore();
    resultCheckSpy.mockReset();
  });
});

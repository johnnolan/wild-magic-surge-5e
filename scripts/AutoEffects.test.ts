import AutoEffects from "./AutoEffects.js";
import "../__mocks__/index.js";

// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockSequenceEffect = jest.fn().mockReturnThis();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockSequenceFile = jest.fn().mockReturnThis();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockSequenceDuration = jest.fn().mockReturnThis();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockSequenceFadeIn = jest.fn().mockReturnThis();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockSequenceFadeOut = jest.fn().mockReturnThis();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockSequenceAtLocation = jest.fn().mockReturnThis();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockSequencePlay = jest.fn().mockReturnThis();
// @ts-expect-error TS(2304): Cannot find name 'jest'.
const mockUiInfo = jest.fn();

// @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
beforeEach(() => {
  mockUiInfo.mockClear();
  mockSequenceEffect.mockClear();
  mockSequenceFile.mockClear();
  mockSequenceDuration.mockClear();
  mockSequenceFadeIn.mockClear();
  mockSequenceFadeOut.mockClear();
  mockSequenceAtLocation.mockClear();
  mockSequencePlay.mockClear();
});

// @ts-expect-error TS(2304): Cannot find name 'global'.
global.Sequence = jest.fn().mockImplementation(() => ({
  play: mockSequencePlay,
  effect: mockSequenceEffect,
  file: mockSequenceFile,
  duration: mockSequenceDuration,
  fadeIn: mockSequenceFadeIn,
  fadeOut: mockSequenceFadeOut,
  atLocation: mockSequenceAtLocation,
}));

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("AutoEffects", () => {
  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("ModuleActive", () => {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Given module is Active", () => {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          modules: {
            get: () => {
              return { active: true };
            },
          },
        };
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It returns true", async () => {
        const result = await AutoEffects.ModuleActive("sequencer");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeTruthy();
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Given module is Inactive", () => {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          modules: {
            get: () => {
              return { active: false };
            },
          },
        };
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It returns true", async () => {
        const result = await AutoEffects.ModuleActive("sequencer");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(result).toBeFalsy();
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("Given AutoEffects setting is disabled", () => {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'global'.
      global.game = {
        settings: {
          // @ts-expect-error TS(2304): Cannot find name 'jest'.
          get: jest.fn().mockReturnValueOnce(false),
        },
      };
    });
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it("It returns undefined", async () => {
      const result = await AutoEffects.Run("tokenid");
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(result).toBeUndefined();
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("Given Effects are enabled", () => {
    // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'global'.
      global.game = {
        settings: {
          // @ts-expect-error TS(2304): Cannot find name 'jest'.
          get: jest.fn().mockResolvedValueOnce(true),
        },
      };
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      AutoEffects.ModuleActive = jest.fn().mockResolvedValue(true);
    });
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Given Sequencer and JB2A are installed and active", () => {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It returns the just the content", async () => {
        await AutoEffects.Run("tokenid");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequenceEffect).toHaveBeenCalledTimes(3);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequenceFile).toHaveBeenCalledTimes(3);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequenceDuration).toHaveBeenCalledTimes(3);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequenceFadeIn).toHaveBeenCalledTimes(3);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequenceFadeOut).toHaveBeenCalledTimes(3);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequenceAtLocation).toHaveBeenCalledTimes(3);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequencePlay).toHaveBeenCalledTimes(1);
      });
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe("Given Effects are disabled", () => {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Given Sequencer is not installed or active", () => {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.ui = {
          notifications: {
            info: mockUiInfo,
          },
        };
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockResolvedValueOnce(true),
          },
        };
        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        AutoEffects.ModuleActive = jest.fn().mockReturnValue(false);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It returns the just the content", async () => {
        await AutoEffects.Run("tokenid");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequenceEffect).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequenceFile).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequenceDuration).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequenceFadeIn).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequenceFadeOut).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequenceAtLocation).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequencePlay).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockUiInfo).toHaveBeenCalledWith(
          `Wild Magic Surge 5e: Play animation on surge is enabled in settings but the sequencer module is not active/installed. Disable the play animation in settings or install and enable sequencer.`
        );
      });
    });

    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe("Given JB2A_DnD5e is not installed or active", () => {
      // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
      beforeEach(() => {
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.ui = {
          notifications: {
            info: mockUiInfo,
          },
        };
        // @ts-expect-error TS(2304): Cannot find name 'global'.
        global.game = {
          settings: {
            // @ts-expect-error TS(2304): Cannot find name 'jest'.
            get: jest.fn().mockResolvedValueOnce(true),
          },
        };

        // @ts-expect-error TS(2304): Cannot find name 'jest'.
        AutoEffects.ModuleActive = jest
          .fn()
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(false);
      });
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it("It returns the just the content", async () => {
        await AutoEffects.Run("tokenid");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequenceEffect).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequenceFile).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequenceDuration).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequenceFadeIn).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequenceFadeOut).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequenceAtLocation).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockSequencePlay).not.toHaveBeenCalled();
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(mockUiInfo).toHaveBeenCalledWith(
          `Wild Magic Surge 5e: Play animation on surge is enabled in settings but the JB2A module is not active/installed. Disable the play animation in settings or install and enable JB2A.`
        );
      });
    });
  });
});

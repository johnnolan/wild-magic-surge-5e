import AutoEffects from "./AutoEffects.js";
import "../__mocks__/index.js";

const mockSequenceEffect = jest.fn().mockReturnThis();

const mockSequenceFile = jest.fn().mockReturnThis();

const mockSequenceDuration = jest.fn().mockReturnThis();

const mockSequenceFadeIn = jest.fn().mockReturnThis();

const mockSequenceFadeOut = jest.fn().mockReturnThis();

const mockSequenceAtLocation = jest.fn().mockReturnThis();

const mockSequencePlay = jest.fn().mockReturnThis();

const mockUiInfo = jest.fn();

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

describe("AutoEffects", () => {
  describe("ModuleActive", () => {
    describe("Given module is Active", () => {
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

      it("It returns true", async () => {
        const result = await AutoEffects.ModuleActive("sequencer");

        expect(result).toBeTruthy();
      });
    });

    describe("Given module is Inactive", () => {
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

      it("It returns true", async () => {
        const result = await AutoEffects.ModuleActive("sequencer");

        expect(result).toBeFalsy();
      });
    });
  });

  describe("Given AutoEffects setting is disabled", () => {
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'global'.
      global.game = {
        settings: {
          get: jest.fn().mockReturnValueOnce(false),
        },
      };
    });

    it("It returns undefined", async () => {
      const result = await AutoEffects.Run("tokenid");

      expect(result).toBeUndefined();
    });
  });

  describe("Given Effects are enabled", () => {
    beforeEach(() => {
      // @ts-expect-error TS(2304): Cannot find name 'global'.
      global.game = {
        settings: {
          get: jest.fn().mockResolvedValueOnce(true),
        },
      };

      AutoEffects.ModuleActive = jest.fn().mockResolvedValue(true);
    });

    describe("Given Sequencer and JB2A are installed and active", () => {
      it("It returns the just the content", async () => {
        await AutoEffects.Run("tokenid");

        expect(mockSequenceEffect).toHaveBeenCalledTimes(3);

        expect(mockSequenceFile).toHaveBeenCalledTimes(3);

        expect(mockSequenceDuration).toHaveBeenCalledTimes(3);

        expect(mockSequenceFadeIn).toHaveBeenCalledTimes(3);

        expect(mockSequenceFadeOut).toHaveBeenCalledTimes(3);

        expect(mockSequenceAtLocation).toHaveBeenCalledTimes(3);

        expect(mockSequencePlay).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Given Effects are disabled", () => {
    describe("Given Sequencer is not installed or active", () => {
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
            get: jest.fn().mockResolvedValueOnce(true),
          },
        };

        AutoEffects.ModuleActive = jest.fn().mockReturnValue(false);
      });

      it("It returns the just the content", async () => {
        await AutoEffects.Run("tokenid");

        expect(mockSequenceEffect).not.toHaveBeenCalled();

        expect(mockSequenceFile).not.toHaveBeenCalled();

        expect(mockSequenceDuration).not.toHaveBeenCalled();

        expect(mockSequenceFadeIn).not.toHaveBeenCalled();

        expect(mockSequenceFadeOut).not.toHaveBeenCalled();

        expect(mockSequenceAtLocation).not.toHaveBeenCalled();

        expect(mockSequencePlay).not.toHaveBeenCalled();

        expect(mockUiInfo).toHaveBeenCalledWith(
          `Wild Magic Surge 5e: Play animation on surge is enabled in settings but the sequencer module is not active/installed. Disable the play animation in settings or install and enable sequencer.`
        );
      });
    });

    describe("Given JB2A_DnD5e is not installed or active", () => {
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
            get: jest.fn().mockResolvedValueOnce(true),
          },
        };

        AutoEffects.ModuleActive = jest
          .fn()
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(false);
      });

      it("It returns the just the content", async () => {
        await AutoEffects.Run("tokenid");

        expect(mockSequenceEffect).not.toHaveBeenCalled();

        expect(mockSequenceFile).not.toHaveBeenCalled();

        expect(mockSequenceDuration).not.toHaveBeenCalled();

        expect(mockSequenceFadeIn).not.toHaveBeenCalled();

        expect(mockSequenceFadeOut).not.toHaveBeenCalled();

        expect(mockSequenceAtLocation).not.toHaveBeenCalled();

        expect(mockSequencePlay).not.toHaveBeenCalled();

        expect(mockUiInfo).toHaveBeenCalledWith(
          `Wild Magic Surge 5e: Play animation on surge is enabled in settings but the JB2A module is not active/installed. Disable the play animation in settings or install and enable JB2A.`
        );
      });
    });
  });
});

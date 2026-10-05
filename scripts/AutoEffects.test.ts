import { setTestGame, setTestGlobal, setTestUi, testGlobals } from "./test/FoundryFixtures";
import AutoEffects from "./AutoEffects";
import Logger from "./Logger";
import "../__mocks__/index.ts";

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

setTestGlobal("Sequence", jest.fn().mockImplementation(() => ({
  play: mockSequencePlay,
  effect: mockSequenceEffect,
  file: mockSequenceFile,
  duration: mockSequenceDuration,
  fadeIn: mockSequenceFadeIn,
  fadeOut: mockSequenceFadeOut,
  atLocation: mockSequenceAtLocation,
})));

describe("AutoEffects", () => {
  describe("ModuleActive", () => {
    describe("Given module is Active", () => {
      beforeEach(() => {
        setTestGame({
          modules: {
            get: () => {
              return { active: true };
            },
          },
        });
      });

      it("It returns true", async () => {
        const result = await AutoEffects._isModuleActive("sequencer");

        expect(result).toBeTruthy();
      });
    });

    describe("Given module is Inactive", () => {
      beforeEach(() => {
        setTestGame({
          modules: {
            get: () => {
              return { active: false };
            },
          },
        });
      });

      it("It returns true", async () => {
        const result = await AutoEffects._isModuleActive("sequencer");

        expect(result).toBeFalsy();
      });
    });
  });

  describe("Given AutoEffects setting is disabled", () => {
    beforeEach(() => {
      setTestGame({
        settings: {
          get: jest.fn().mockReturnValueOnce(false),
        },
      });
    });

    it("It returns undefined", async () => {
      const result = await AutoEffects.Run("tokenid");

      expect(result).toBeUndefined();
    });
  });

  describe("Given Effects are enabled", () => {
    beforeEach(() => {
      setTestGame({
        settings: {
          get: jest.fn().mockResolvedValueOnce(true),
        },
      });

      AutoEffects._isModuleActive = jest.fn().mockResolvedValue(true);
    });

    describe("Given Sequencer and JB2A are installed and active", () => {
      it("reports a rejected animation without delaying the surge", async () => {
        const failure = new Error("animation failed");
        mockSequencePlay.mockRejectedValueOnce(failure);
        const report = jest.spyOn(Logger, "error").mockImplementation(() => undefined);
        try {
          await expect(AutoEffects.Run("tokenid")).resolves.toBeUndefined();
          await Promise.resolve();
          expect(report).toHaveBeenCalledWith(
            "Wild Magic Surge animation failed", "AutoEffects.Run", failure,
          );
        } finally {
          report.mockRestore();
        }
      });

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
        setTestUi({
          notifications: {
            info: mockUiInfo,
          },
        });
        setTestGame({
          settings: {
            get: jest.fn().mockResolvedValueOnce(true),
          },
        });

        AutoEffects._isModuleActive = jest.fn().mockReturnValue(false);
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
        setTestUi({
          notifications: {
            info: mockUiInfo,
          },
        });
        setTestGame({
          settings: {
            get: jest.fn().mockResolvedValueOnce(true),
          },
        });

        AutoEffects._isModuleActive = jest
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

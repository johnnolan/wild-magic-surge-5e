(global as any).ChatMessage = {
  create: jest.fn().mockResolvedValue(null),
  getSpeaker: () => ({
    scene: null,
    actor: null,
    token: null,
    alias: "Test Speaker",
  }),
  getWhisperRecipients: () => {
    return [{ id: "gm-id" }];
  },
};

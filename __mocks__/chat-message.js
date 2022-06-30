global.ChatMessage = {
  create: jest.fn().mockResolvedValue(null),
  getWhisperRecipients: (v) => {
    return [{ _id: "" }];
  },
};

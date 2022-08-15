import { actor } from "./actor";

export const chatMessage = {
  content: "1st Level",
  user: {
    id: "123",
  },
  speaker: {
    actor: actor,
  },
};

export const chatMessageNoSpell = {
  content: "Big Sword Garh",
  user: "123",
  speaker: {
    actor: actor,
  },
};

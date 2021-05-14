export async function SendChat(message, result = "") {
  let chatData = {
    user: game.user.id,
    speaker: game.user,
    content: `<div>${message} ${result}</div>`,
  };
  return ChatMessage.create(chatData, {});
}

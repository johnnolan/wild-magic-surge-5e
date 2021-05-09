export function SendChat(chatMessage) {
  let chatData = {
    user: game.user.id,
    speaker: game.user,
    content: `<div>${chatMessage.toString()}</div>`,
  };
  ChatMessage.create(chatData, {});
}

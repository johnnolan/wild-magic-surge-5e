function printMessage(message) {
  let chatData = {
    user: game.user.id,
    content: message,
    blind: true,
    whisper: game.users.filter((u) => u.isGM).map((u) => u.id),
  };

  ChatMessage.create(chatData, {});
}

var hasSurged = actor.getFlag("wild-magic-surge-5e", "hassurged");

if (hasSurged) {
  printMessage('<p style="color:red;">Wild magic has been triggered.</p>');
} else {
  printMessage(
    '<p style="color:green;">Wild magic has not been triggered.</p>'
  );
}

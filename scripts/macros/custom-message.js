function printMessage(message) {
  let chatData = {
    user: game.user.id,
    content: message,
  };

  ChatMessage.create(chatData, { messageMode: "blind" });
}

var hasSurged = actor.getFlag("wild-magic-surge-5e", "hassurged");

if (hasSurged) {
  printMessage('<p style="color:red;">Wild magic has been triggered.</p>');
} else {
  printMessage(
    '<p style="color:green;">Wild magic has not been triggered.</p>',
  );
}

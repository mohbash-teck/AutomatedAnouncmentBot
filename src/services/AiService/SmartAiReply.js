
// any kind of ai text reply logic written here

const {GeminiClient} = require("../../Clients/GeminiClient");

async function SmartReply(prompt) {
    const protectionprompt = `try to response with less than 1000 words to this prompt: ${prompt}`
    const result = await GeminiClient.model.generateContent(protectionprompt);
    const response = await result.response;
    const text = response.text();
    return text
};

async function GetGptChat() {
  const chat = GeminiClient.model.startChat({
    history: [], // Start fresh; or you can preload past messages here
  });
  return chat;
}

module.exports = {SmartReply, GetGptChat};

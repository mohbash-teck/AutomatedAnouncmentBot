
// any kind of ai text reply logic written here

const {GeminiClient} = require("../../Clients/GeminiClient");

async function SmartReply(prompt) {
  try{
      const protectionprompt = `try to response with less than 1000 words to this prompt: ${prompt}`
      const result = await GeminiClient.model.generateContent(protectionprompt);
      const response = await result.response;
      const text = response.text();
      return text
  } catch {
    console.log("error while waiting for ai response");
  }
};

async function GetGptChat(psersona) {
  try {
    const chat = await GeminiClient.model.startChat({
        role: "user",
        parts: [{ text: psersona}]
      });
    return chat;
  } catch {
    console.log("error while requesting a new chat object")
  }
}

module.exports = {SmartReply, GetGptChat};

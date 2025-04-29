
const {SmartReply, GetGptChat} = require("../../services/AiService/SmartAiReply");
const {SendMessage} =  require("../../services/telegram/SendMessage");
// const {AnouncmentsBot} = require("../../../Clients/telegram/AnouncmentsBot");

async function OnMessageSmartAiReplyController(bot,mainchatid=Null) {

bot.on("message", async (ctx) => {
    const message = ctx.message;
    if (message){
        console.log(`new message from ${message.chat.id} recieved`);
        if (mainchatid && mainchatid == message.chat.id) {
            const AiAns = await SmartReply(message.text);
            await SendMessage(bot,mainchatid,AiAns);
        } else {
            console.log("general mode ..");
        }
    }
});
};

async function OnMessageAiChatController(bot, mainchatid, psersona) {

    const chat = await GetGptChat(psersona);
   
    // await chat.sendMessage(psersona);

    bot.on("message", async (ctx) => {
        const message = ctx.message
        if (message && mainchatid && mainchatid == message.chat.id) {
            console.log(`new message from ${message.chat.id} recieved`);
            const prompt = `persona part:${psersona}\n\n  user request part: ${message.text}`
            const protectionprompt = `response with less than 1000 words to this prompt and \
            make sure the responce is for the user part not the instructions before \
            also don't responce with markdown format:\n ${prompt}`
            try {
            const reply = await chat.sendMessage(protectionprompt);
            ctx.reply(reply.response.text());
            } catch {
                console.log("error while waitng for bot response");
            }
        } else {
            console.log("general mode ..")
        }
    });
}

module.exports = {
    OnMessageSmartAiReplyController,
    OnMessageAiChatController
}
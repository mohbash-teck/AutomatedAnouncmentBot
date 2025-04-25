
const {SmartReply} = require("../../services/AiService/SmartAiReply");
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

module.exports = {
    OnMessageSmartAiReplyController
}
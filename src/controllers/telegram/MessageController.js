
// const {AnouncmentsBot} = require("../../../Clients/telegram/AnouncmentsBot");

async function OnMessageController(ctx) {
    const message = ctx.message;
    if (message){
        console.log(`new message from ${message.chat.id} recieved`);
}};

module.exports = {
    OnMessageController
}
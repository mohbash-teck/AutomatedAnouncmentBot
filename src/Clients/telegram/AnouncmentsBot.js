
// here i only create AnouncmentsBot instance
// any listning or events handler should be in the controller

const {Bot} = require("grammy");
const {telegram} = require("../../config/ActiveBots");  // this object contain the meatdata of all telegram bots

const AnouncmentsBot = new Bot(telegram.AnouncmentsBot.BotToken);

// bot start
AnouncmentsBot.start();

module.exports = {AnouncmentsBot};

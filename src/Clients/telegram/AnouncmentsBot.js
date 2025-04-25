
// here i only create AnouncmentsBot instance
// any listning or events handler should be in the controller

const {Bot} = require("grammy");
const {telegram} = require("../../config/ActiveBots");  // this object contain the meatdata of all telegram bots

const AnnouncmentsBot = new Bot(telegram.AnnouncmentsBot.BotToken);
module.exports = {AnnouncmentsBot};

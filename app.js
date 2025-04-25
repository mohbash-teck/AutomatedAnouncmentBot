
const {AnnouncmentsBot} = require("./src/Clients/telegram/AnouncmentsBot.js");
const {OnMessageController} = require("./src/controller/telegram/MessageController");
const {IuBbAnnouncmentsScrapingController} = require("./src/controller/telegram/IuBbAnnouncmentsScrapingController");
const {OnMessageSmartAiReplyController} = require("./src/controller/telegram/SmartReplyController");

const corn = require("node-cron");
const dotenv = require("dotenv");
dotenv.config();



const mainchatid = process.env.MAIN_CHAT_ID

// start the AnouncmentsBot
AnnouncmentsBot.start();

// setup the the commands of the bot
AnnouncmentsBot.command("start", () => {
    console.log("new session to the bot");
})
AnnouncmentsBot.command("scrap", () => {
    IuBbAnnouncmentsScrapingController(AnnouncmentsBot,mainchatid);
})

OnMessageSmartAiReplyController(AnnouncmentsBot,mainchatid);

// set the daliy routine for scraping Announcments
corn.schedule("00 12 * * *", async () => {
    console.log("start the first scheduled check routine ..")
    IuBbAnnouncmentsScrapingController(AnouncmentsBot,mainchatid);
});


// set the daliy routine for scraping Announcments
corn.schedule("59 23 * * *", async () => {
    console.log("start the second scheduled check routine ..")
    IuBbAnnouncmentsScrapingController(AnouncmentsBot,mainchatid);
});



// any other
// ........
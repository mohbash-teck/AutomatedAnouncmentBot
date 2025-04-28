
const {AnnouncmentsBot} = require("./src/Clients/telegram/AnouncmentsBot.js");
const {OnMessageController} = require("./src/controller/telegram/MessageController");
const {IuBbAnnouncmentsScrapingController} = require("./src/controller/telegram/IuBbAnnouncmentsScrapingController");
const {OnMessageSmartAiReplyController} = require("./src/controller/telegram/SmartReplyController");
const { OnMessageAiChatController} = require("./src/controller/telegram/SmartReplyController");


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
AnnouncmentsBot.command("scrap", async () => {
    await IuBbAnnouncmentsScrapingController(AnnouncmentsBot,mainchatid);
})

const persona = "From now on your name is mohbash, you will act as my personal sekeratry\
here is some info about me : my name is mohamed bashir, i am a developer, i love building helpfull things\
i speak arabic and english, i study EE at IU in madinah"
OnMessageAiChatController(AnnouncmentsBot,mainchatid, persona);

// set the daliy routine for scraping Announcments
corn.schedule("20 01 * * *", async () => {
    console.log("start the first scheduled check routine ..")
    IuBbAnnouncmentsScrapingController(AnnouncmentsBot,mainchatid);
});


// set the daliy routine for scraping Announcments
corn.schedule("59 23 * * *", async () => {
    console.log("start the second scheduled check routine ..")
    IuBbAnnouncmentsScrapingController(AnnouncmentsBot,mainchatid);
});



// any other
// ........


const {StartScraping} = require("../../services/IU-Scraping/AnnouncmentsSraper");
const {GetAnnouncments} = require("../../models/Announcments");
const {SendMessage, SendAnnouncments} = require("../../services/telegram/SendMessage");


async function IuBbAnnouncmentsScrapingController(bot,chatid) {

    console.log("start scraping process ...");
    await SendMessage(bot, chatid, "start process of Sraping New Announcments ...");
    const NewAnnouncmentAvailable = await StartScraping();

    if (NewAnnouncmentAvailable) {
        const NewAnnouncments = await GetAnnouncments();

        console.log("start the process of sending new Announcments ");
        SendAnnouncments(bot=bot, chatid=chatid,AnnouncementsObejct=NewAnnouncments);

        console.log("finished scraping and sending Announcments.");

    } else {
        const message = "No New Announcments dedticted."
        console.log(message);
        SendMessage(bot,chatid,message)
    }
}

module.exports = {
    IuBbAnnouncmentsScrapingController
};
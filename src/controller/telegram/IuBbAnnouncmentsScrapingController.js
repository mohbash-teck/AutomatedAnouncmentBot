

const {StartScraping} = require("../../services/IU-Scraping/AnnouncmentsSraper");
const {GetAnnouncments} = require("../../models/Announcments");
const {SendAnnouncments} = require("../../services/telegram/SendMessage");


async function IuBbAnnouncmentsScrapingController(bot,chatid) {

    console.log("start scraping process ...");
    const NewAnnouncmentAvailable = await StartScraping();

    if (NewAnnouncmentAvailable) {
        console.log("start process of fetching New Announcments ...");
        const NewAnnouncments = GetAnnouncments();

        console.log("start the process of sending new Announcments ");
        await SendAnnouncments(bot=bot, chatid=chatid,AnnouncementsObejct=NewAnnouncments);

        console.log("finished scraping and sending Announcments.");

    } else {
        console.log("No New Announcments dedticted.");
    }
}

module.exports = {
    IuBbAnnouncmentsScrapingController
};
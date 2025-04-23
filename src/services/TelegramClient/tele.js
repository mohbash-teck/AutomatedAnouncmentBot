
const {Bot} = require("grammy");
const dotenv = require("dotenv");
const {StartScraping} = require("./scraper/scrap.js");
const cron = require('node-cron');
const {GptChat, SmartReply} = require("../services/GenerativeAIEntegration.js");
dotenv.config()

const token = process.env.TELEGRAM_BOT_TOKEN || "8090008599:AAGHOrTk6WE59VenDTR7SMniSI_SEbbpKxE"
const mainchatid = process.env.MAIN_CHAT_ID || "1105899852"
const bot = new Bot(token);
const fs = require("fs");

// commands
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));


async function SetRoutines() {
    // gpt chat
    const AiChat = GptChat()

    // events
    bot.on("message", async (ctx) => {
        const message = ctx.message;

        if (message){
            console.log(`new message from ${message.chat.id} recieved`);
            if (message.chat.id == mainchatid){
                const reply = await SmartReply(message.text);
                // console.log(reply)
                await bot.api.sendMessage(mainchatid, reply);
            }
    }});


    // schedular
    cron.schedule("53 21 * * *", async () => {
        const NewTask = await StartScraping();
        if (NewTask) {
            setTimeout(async () => {
                const rawData = fs.readFileSync('./announcments/announcements.json', 'utf-8');
                const content = JSON.parse(rawData);
                
                for (const [course, notes] of Object.entries(content)) {
                    for (const note of notes) {
                        const message = `📘 ${course}:\n- ${note}`;
                        await bot.api.sendMessage(mainchatid, message);
                    }
                }
            }, 5000);
        }
    });
}

async function StartFetching() {
    const NewTask = await StartScraping();
    if (NewTask) {
        console.log("started scraping");
        setTimeout(async () => {
            const rawData = fs.readFileSync('./announcments/announcements.json', 'utf-8');
            const content = JSON.parse(rawData);

            for (const [course, notes] of Object.entries(content)) {
                for (const note of notes) {
                    const message = `📘   ${course}:\n- ${note}`;
                    await bot.api.sendMessage(mainchatid, message);
            }}})
        return true
    } else {
        return false
    }

};

// bot start
bot.start();

module.exports = {bot, SetRoutines, StartFetching};
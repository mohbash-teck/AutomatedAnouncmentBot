// app.js

require('dotenv').config();

const cron = require("node-cron");

const {
  AnnouncmentsBot
} = require("./src/Clients/telegram/AnouncmentsBot.js");

const {
  IuBbAnnouncmentsScrapingController
} = require("./src/controllers/telegram/IuBbAnnouncmentsScrapingController");

const {
  OnMessageAiChatController
} = require("./src/controllers/telegram/MessageController");

const {
    SendMessageController
} = require("./src/controllers/telegram/MessageController")

// Config
const config = {
  mainChatId: process.env.MAIN_CHAT_ID,
  scheduleIsOn: true,
  persona: `From now on your name is mohbash, you will act as my personal secretary.
           Here is some info about me: my name is Mohamed Bashir, I am a developer, I love building helpful things.
           I speak Arabic and English, I study EE at IU in Madinah.`,
};

// set the bot commands
async function registerBotCommands(bot, chatId) {
  bot.command("start", () => {
    console.log("new user started the bot.");
  });

  bot.command("scrap", async () => {
    await IuBbAnnouncmentsScrapingController(bot, chatId);
  });

  bot.command("schedule", () => {
    config.scheduleIsOn = !config.scheduleIsOn;
    const status = `Schedule is now ${config.scheduleIsOn ? "ON" : "OFF"}`
    SendMessageController(bot,chatId,status);
  });
}

// Scheduling jobs
async function setupSchedules(bot, chatId) {
  // Runs every day at 12:00
  cron.schedule("0 12 * * *", async () => {
    console.log("Running scheduled scraping at 12:00");
    if (config.scheduleIsOn) {
      await IuBbAnnouncmentsScrapingController(bot, chatId);
    }
  });

  // Runs every day at 23:59
  cron.schedule("21 19 * * *", async () => {
    console.log("Running scheduled scraping at 23:59");
    if (config.scheduleIsOn) {
      await IuBbAnnouncmentsScrapingController(bot, chatId);
    }
  });
}


async function main() {
  try {
    AnnouncmentsBot.start();
    registerBotCommands(AnnouncmentsBot, config.mainChatId);

    // Initialize AI chat controller with persona
    OnMessageAiChatController(AnnouncmentsBot, config.mainChatId, config.persona);

    setupSchedules(AnnouncmentsBot, config.mainChatId);

    console.log("Bot started and schedules set.");
  } catch (err) {
    console.error("Error during bot startup:", err);
    process.exit(1);
  }
}

main();



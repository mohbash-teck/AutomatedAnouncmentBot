
const dotenv = require("dotenv");

dotenv.config();

modules.export = {

    telegram: {
        AnouncmentsBot: {
            BotName: process.env.TELEGRAM_BOT_NAME,
            BotToken: process.env.TELEGRAM_BOT_TOKEN,
            enabled: true
        }
    }
    
}
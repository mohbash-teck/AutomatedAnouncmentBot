
const dotenv = require("dotenv");

dotenv.config();

module.exports = {

    telegram: {
        AnnouncmentsBot: {
            BotName: process.env.TELEGRAM_BOT_NAME,
            BotToken: process.env.TELEGRAM_BOT_TOKEN,
            MainChatId: process.env.MAIN_CHAT_ID,
            Enabled: true
        }
    },
    
    
}
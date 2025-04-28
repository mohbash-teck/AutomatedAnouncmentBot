
// the general logic for sending messages with telegram bots

/**
 * send messages general logic for all telegram bots
 * @param {*} bot 
 * @param {*} chatid 
 * @param {*} message 
 */
async function SendMessage(bot,chatid,message) {
    await bot.api.sendMessage(
        chatid,
        message,
        { parse_mode: "Markdown"}
    );
}

/**
 * send Announcments to certain chat
 * @param {*} bot
 * @param {*} chatid 
 * @param {*} AnnouncementsObejct : this must be Announcments object only
 */
async function SendAnnouncments(bot, chatid, AnnouncementsObejct) {
    for (const [course, notes] of Object.entries(AnnouncementsObejct)) {
                        for (const note of notes) {
                            const message = `📘 ${course}:\n- ${note}`;
                            bot.api.sendMessage(
                                chatid,
                                message,
                                {
                                    parse_mode: "Markdown"
                                }
                                  
                            )
                        }
                    }
};

module.exports = {SendMessage, SendAnnouncments};

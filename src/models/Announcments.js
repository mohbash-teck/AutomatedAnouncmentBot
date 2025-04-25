
// store Anouncments into the database

const fs = require("fs");

async function StoreAnouncments(announcements) {
    try{
        if (Object.keys(announcements).length > 0) {
          fs.writeFileSync('./src/database/announcments/announcements.json', JSON.stringify(announcements, null, 2), 'utf-8');
            console.log('✅ Data saved as pretty JSON in announcements.json');
            await browser.close();
            return true;
        } else {
            console.log('📭 No new announcements to save.');
            await browser.close();
            return false;
        }
    } catch (error) {
        console.log("❌ Error while parsing announcements:", error.message);
        // await browser.close();
        return false;
    }
}

/**
 * get the announcments from the db
 * @return: announcments object
 */
function GetAnnouncments() {
    
    const rawData = fs.readFileSync('./src/database/announcments/announcements.json', 'utf-8');
    const content = JSON.parse(rawData);
    return content
}

module.exports = {StoreAnouncments, GetAnnouncments};
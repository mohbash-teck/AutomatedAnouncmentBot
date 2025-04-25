
const puppeteer = require("puppeteer");
const fs = require("fs");
const {ExtractCapchaCode} = require("./services/Aiservice/GenerativeAIEntegration.js");
const {StoreAnouncments} = require("../../models/Announcments.js");
const {saveBase64ImageOfCaptchaCode} = require("../../models/ImageStorage.js");


/**
 * - acuall scraping logic of the Black board annoucments in this func
 * @returns  return true if new announcments fetched other wise false (no announcments or error)
 */
async function FetchNewAnouncments() {

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    console.log("New tab created.");

    await page.goto("https://eservices.iu.edu.sa/Dashboard");
    console.log("Login page opened.");

    const CaptchaImage = await page.evaluate(() => {
      // get the image of the captcha
      const image = document.getElementById("CaptchaImage");
      return image?.src;
    });

    if (!CaptchaImage) {
        console.log("Captcha image not found");
        await browser.close();
        return false;
    }

    const encodedCaptcha = await saveBase64ImageOfCaptchaCode(CaptchaImage, "../screenshots/capcha.png");
    const CaptcaCode = await ExtractCapchaCode(encodedCaptcha);
    console.log(`Captcha code: ${CaptcaCode}`);

     try {
      // fill the required fields
      await page.type('#Username', process.env.USER_NUMBER);
      await page.type('#password', process.env.USER_PASSWORD);
      await page.type('#CaptchaValue', CaptcaCode);
    } catch (error) {
        console.log("❌ Error filling fields:", error);
        await browser.close();
        return false;
    }

     try {
        await page.waitForSelector('a.system[href="https://iu.blackboard.com"]', { timeout: 10000 });
        console.log("Dashboard loaded");
    } catch {
        console.log("⌛ Dashboard did not load in time");
        await browser.close();
        return false;
    }

     // Open Blackboard in new tab
    try {
        const [newPage] = await Promise.all([
            new Promise(resolve => {
                page.browser().once('targetcreated', async target => {
                    const newTab = await target.page();
                    await newTab.bringToFront();
                    resolve(newTab);
                });
            }),
            page.click('a.system[href="https://iu.blackboard.com"]'),
        ]);

         //  wait for page load or selector cause it is sometimes take too long in the page
        // i mean it may be loaded but with message: wait unitl fully load (its like fast loaded content till the acuall content loaded)
        // thats why i give it more time
        await newPage.waitForSelector('#div_1_1', { timeout: 10000 }).catch(() => {});
         try {
            // Try to wait for announcements
            await newPage.waitForFunction(() => {
                const container = document.getElementById('div_1_1');
                return container && container.querySelectorAll('h3').length > 0;
            }, { timeout: 10000 });
        } catch {
          // if i didn't find announcments then no need to complete the process
            console.log("⚠️ No announcements found (or didn't load in time)");
        }

         // Screenshot for debug
        await newPage.screenshot({ path: "./logs/images/debugBbtab.png", fullPage: true });

         const announcements = await newPage.evaluate(() => {
            const data = {};
            const container = document.getElementById('div_1_1');
            if (!container) return data;

             const courseTitles = container.querySelectorAll('h3');
            courseTitles.forEach(title => {
                const courseName = title.innerText.trim();
                const announcementsList = [];
                let sibling = title.nextElementSibling;

                 while (sibling && !sibling.classList.contains('courseDataBlock')) {
                    sibling = sibling.nextElementSibling;
                }

                 if (sibling) {
                    const links = sibling.querySelectorAll('li a');
                    links.forEach(link => {
                        announcementsList.push(link.innerText.trim());
                    });
                }

                 data[courseName] = announcementsList;
            });

             return data;
        });

         if (Object.keys(announcements).length > 0) {
          await StoreAnouncments(announcements)
          return true;
        } else {
          console.log('📭 No new announcements to save.');
          await browser.close();
          return false;
        }
    } catch (error) {
        console.log("❌ Error while parsing announcements:", error.message);
        await browser.close();
        return false;
    }
}
  
async function StartScraping() {
    const status = await FetchNewAnouncments();
    console.log("Done! Success:", status);
    return status
}
  
module.exports = {StartScraping};
  


const puppeteer = require("puppeteer");
const {SaveBase64ImageOfCaptchaCode} = require("../../models/ImageStorage.js");
const {StoreAnouncments} = require("../../models/Announcments.js");
const {ExtractCapchaCode} = require("../AiService/ImageProcess.js");
const {Credentials} = require("../../config/IU.js");
console.log(typeof SaveBase64ImageOfCaptchaCode);

/**
 * - acuall scraping logic of the Black board annoucments in this func
 * @returns  return true if new announcments fetched other wise false (no announcments or error)
 */
async function FetchResults() {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    console.log("New tab created.");

    // Set a fake Firefox user agent to bypass bot detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0');

    await page.goto("https://eservices.iu.edu.sa/Dashboard");
    console.log("Login page opened.");

    await page.screenshot({ path: './src/screenshots/login_page.png', fullPage: false });
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
    
    const CaptcaCodeBase64String = SaveBase64ImageOfCaptchaCode(CaptchaImage);
    const CaptcaCode = await ExtractCapchaCode(CaptcaCodeBase64String);
    console.log(`Captcha code: ${CaptcaCode}`);

     try {
      // fill the required fields
      await page.type('#Username', Credentials.ID);
      await page.type('#password', Credentials.PASSWORD);
      await page.type('#CaptchaValue', CaptcaCode);
    } catch (error) {
        console.log("❌ Error filling fields:", error);
        await browser.close();
        return false;
    }

     try {
        await page.waitForSelector('a.system[href="https://iu.blackboard.com"]', { timeout: 50000 });
        console.log("Dashboard loaded");
    } catch {
        console.log("⌛ Dashboard did not load in time");
        await browser.close();
        return false;
    }

     // Open acadmic system in new tab
    try {
        console.log("opening acadmic system page ...");
        const [newPage] = await Promise.all([
            new Promise(resolve => {
                page.browser().once('targetcreated', async target => {
                    const newTab = await target.page();
                    await newTab.bringToFront();
                    resolve(newTab);
                });
            }),
            page.click('a.system[https://cas.iu.edu.sa/cas/eregister"]'),
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
        await newPage.screenshot({ path: "./src/screenshots/bb.png", fullPage: true });

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
    try {
    const status = await FetchResults();
    console.log("Done! Success:", status);
    return status } catch {
        console.log("faliure during scraping process");
    }
}
  
StartScraping()
  


const puppeteer = require("puppeteer");
const {SaveBase64ImageOfCaptchaCode} = require("../../models/ImageStorage.js");
const {StoreAnouncments} = require("../../models/Announcments.js");
const {ExtractCapchaCode} = require("../AiService/ImageProcess.js");
const {Credentials} = require("../../config/IU.js");


// /**
//  * - acuall scraping logic of the Black board annoucments in this func
//  * @returns  return true if new announcments fetched other wise false (no announcments or error)
//  */
// async function FetchNewAnouncments() {

//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     console.log("New tab created.");

//     // Set a fake Firefox user agent to bypass bot detection
//     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0');

//     await page.goto("https://eservices.iu.edu.sa/Dashboard");
//     console.log("Login page opened.");

//     await page.screenshot({ path: './src/screenshots/login_page.png', fullPage: true });
//     const CaptchaImage = await page.evaluate(() => {
//       // get the image of the captcha
//       const image = document.getElementById("CaptchaImage");
//       return image?.src;
//     });

//     if (!CaptchaImage) {
//         console.log("Captcha image not found");
//         await browser.close();
//         return false;
//     }
    
//     const CaptcaCodeBase64String = SaveBase64ImageOfCaptchaCode(CaptchaImage);
//     const CaptcaCode = await ExtractCapchaCode(CaptcaCodeBase64String);
//     console.log(`Captcha code: ${CaptcaCode}`);

//      try {
//       // fill the required fields
//       await page.type('#Username', Credentials.ID);
//       await page.type('#password', Credentials.PASSWORD);
//       await page.type('#CaptchaValue', CaptcaCode);
//     } catch (error) {
//         console.log("❌ Error filling fields:", error);
//         await browser.close();
//         return false;
//     }

//      try {
//         await page.waitForSelector('a.system[href="https://iu.blackboard.com"]', { timeout: 50000 });
//         console.log("Dashboard loaded");
//     } catch {
//         console.log("⌛ Dashboard did not load in time");
//         await browser.close();
//         return false;
//     }

//      // Open Blackboard in new tab
//     try {
//         console.log("opening blackboard page ...");
//         const [newPage] = await Promise.all([
//             new Promise(resolve => {
//                 page.browser().once('targetcreated', async target => {
//                     const newTab = await target.page();
//                     await newTab.bringToFront();
//                     resolve(newTab);
//                 });
//             }),
//             page.click('a.system[href="https://iu.blackboard.com"]'),
//         ]);

//          //  wait for page load or selector cause it is sometimes take too long in the page
//         // i mean it may be loaded but with message: wait unitl fully load (its like fast loaded content till the acuall content loaded)
//         // thats why i give it more time
//         await newPage.waitForSelector('#div_1_1', { timeout: 10000 }).catch(() => {});
//          try {
//             // Try to wait for announcements
//             await newPage.waitForFunction(() => {
//                 const container = document.getElementById('div_1_1');
//                 return container && container.querySelectorAll('h3').length > 0;
//             }, { timeout: 10000 });
//         } catch {
//           // if i didn't find announcments then no need to complete the process
//             console.log("⚠️ No announcements found (or didn't load in time)");
//         }

//          // Screenshot for debug
//         await newPage.screenshot({ path: "./src/screenshots/bb.png", fullPage: true });

//          const announcements = await newPage.evaluate(() => {
//             const data = {};
//             const container = document.getElementById('div_1_1');
//             if (!container) return data;

//              const courseTitles = container.querySelectorAll('h3');
//             courseTitles.forEach(title => {
//                 const courseName = title.innerText.trim();
//                 const announcementsList = [];
//                 let sibling = title.nextElementSibling;

//                  while (sibling && !sibling.classList.contains('courseDataBlock')) {
//                     sibling = sibling.nextElementSibling;
//                 }

//                  if (sibling) {
//                     const links = sibling.querySelectorAll('li a');
//                     links.forEach(link => {
//                         announcementsList.push(link.innerText.trim());
//                     });
//                 }

//                  data[courseName] = announcementsList;
//             });

//              return data;
//         });

//          if (Object.keys(announcements).length > 0) {
//           await StoreAnouncments(announcements)
//           return true;
//         } else {
//           console.log('📭 No new announcements to save.');
//           await browser.close();
//           return false;
//         }
//     } catch (error) {
//         console.log("❌ Error while parsing announcements:", error.message);
//         await browser.close();
//         return false;
//     }
// }


/**
 * - acuall scraping logic of the Black board annoucments in this func
 * @returns  return true if new announcments fetched other wise false (no announcments or error)
 */
async function FetchNewAnouncmentsV2() {
    const browser = await puppeteer.launch({ headless: false }); // Keep headless: false for visual debugging
    const page = await browser.newPage();
    console.log("New tab created.");

    // Set a fake Firefox user agent to bypass bot detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0');

    try {
        await page.goto("https://eservices.iu.edu.sa/Dashboard");
        console.log("Login page opened.");

        await page.screenshot({ path: './src/screenshots/login_page.png', fullPage: true });
        const CaptchaImage = await page.evaluate(() => {
            // Get the image of the captcha
            const image = document.getElementById("CaptchaImage");
            return image?.src;
        });

        if (!CaptchaImage) {
            console.log("Captcha image not found.");
            await browser.close();
            return false;
        }

        const CaptcaCodeBase64String = SaveBase64ImageOfCaptchaCode(CaptchaImage);
        const CaptcaCode = await ExtractCapchaCode(CaptcaCodeBase64String);
        console.log(`Captcha code: ${CaptcaCode}`);

        try {
            // Fill the required fields
            await page.type('#Username', Credentials.ID);
            await page.type('#password', Credentials.PASSWORD);
            await page.type('#CaptchaValue', CaptcaCode);

            // You might need a click event here if there's a submit button
            // Example: await Promise.all([
            //     page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 50000 }),
            //     page.click('your_submit_button_selector')
            // ]);

        } catch (error) {
            console.log("❌ Error filling fields:", error);
            await browser.close();
            return false;
        }

        try {
            // Wait for the dashboard to load after login
            await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });
            // Ensure the Blackboard link is visible and clickable on the dashboard
            await page.waitForSelector('a.system[href="https://iu.blackboard.com"]', { timeout: 10000 });
            console.log("Dashboard loaded.");
        } catch (error) {
            console.log(`⌛ Dashboard did not load in time or Blackboard link not found: ${error.message}`);
            await browser.close();
            return false;
        }

        // Open Blackboard in new tab
        console.log("Opening Blackboard page...");
        const [newPage] = await Promise.all([
            new Promise(resolve => {
                page.browser().once('targetcreated', async target => {
                    const newTab = await target.page();
                    await newTab.bringToFront();
                    // Wait for the new Blackboard tab to navigate and settle down network-wise
                    try {
                        await newTab.waitForNavigation({ waitUntil: 'networkidle0', timeout: 90000 });
                        console.log("Blackboard new tab network idle.");
                    } catch (navError) {
                        console.log(`⚠️ New Blackboard tab navigation networkidle timed out (might be okay if content loads dynamically): ${navError.message}`);
                        // Don't return false here immediately, as content might still appear
                    }
                    resolve(newTab);
                });
            }),
            page.click('a.system[href="https://iu.blackboard.com"]'),
        ]);



        try {
            console.log("Blackboard new tab detected. Adding a short delay for rendering stabilization...");
            // Add a fixed wait time to allow the browser to fully render dynamic content
            // await newPage.waitForTimeout(7000); // Wait for 7 seconds

            console.log("Delay finished. Waiting for Blackboard announcement content to be fully rendered with text...");
            await newPage.waitForFunction(() => {
                // CORRECTED SELECTOR: Looking for '.activity-group' as identified in your HTML
                const activityGroups = document.querySelectorAll('.activity-group');
                // Check if there's at least one activity-group AND if any of them contain an h2 element with non-empty text
                return activityGroups.length > 0 &&
                       Array.from(activityGroups).some(group => {
                           const h2 = group.querySelector('h2');
                           // Ensure h2 exists and has actual text content
                           return h2 && h2.innerText.trim().length > 0;
                       });
            }, { timeout: 120000 }); // Extended timeout to 2 minutes (120 seconds)
            console.log("Blackboard announcement content elements found and rendered with text.");

        } catch (error) {
            console.log(`❌ Blackboard page announcement elements were not found or did not render in time: ${error.message}`);
            // Capture a screenshot at the point of failure for debugging
            await newPage.screenshot({ path: "./src/screenshots/bb_error_render_timeout.png", fullPage: true });
            await browser.close();
            return false;
        }

        // Screenshot for debug (if the above wait succeeds)
        await newPage.screenshot({ path: "./src/screenshots/bb_final_loaded.png", fullPage: true });

        //Parsing the Announcements
        // The parsing logic has also been updated to use the correct `activity-group` selector.

        // Parse the stream page to construct the announcements obj
        const announcements = await newPage.evaluate(() => {
            const data = {};
            // CORRECTED SELECTOR: Using '.activity-group' here as well
            const activityGroups = document.querySelectorAll('.activity-group'); // Select all activity groups

            activityGroups.forEach(group => {
                const courseTitleElement = group.querySelector('h2'); // Find the course title within the group
                if (!courseTitleElement) return;

                const courseName = courseTitleElement.innerText.trim();
                const announcementsList = [];

                // Find the next sibling element that contains the announcements list (a ul)
                // This logic correctly traverses siblings to find the <ul> after the <h2>
                let sibling = courseTitleElement.nextElementSibling;
                while (sibling && sibling.tagName !== 'UL') {
                    sibling = sibling.nextElementSibling;
                }

                if (sibling && sibling.tagName === 'UL') {
                    const links = sibling.querySelectorAll('li a'); // Find all links within the LI elements
                    links.forEach(link => {
                        announcementsList.push(link.innerText.trim());
                    });
                }
                data[courseName] = announcementsList;
            });
            return data;
        });

        if (Object.keys(announcements).length > 0) {
            await StoreAnouncments(announcements);
            console.log('✅ Announcements successfully parsed and stored.');
            await browser.close();
            return true;
        } else {
            console.log('📭 No new announcements found or parsed.');
            await browser.close();
            return false;
        }
    } catch (error) {
        console.log("❌ An unhandled error occurred during the process:", error.message);
        await browser.close();
        return false;
    }
}



async function passLoginPage() {
    const browser = await puppeteer.launch({ headless: false }); // Keep headless: false for visual debugging
    const page = await browser.newPage();
    console.log("New tab created.");

    // Set a fake Firefox user agent to bypass bot detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0');

    try 
    {
        await page.goto("https://eservices.iu.edu.sa/Dashboard");
        console.log("Login page opened.");

        await page.screenshot({ path: './src/screenshots/login_page.png', fullPage: true });
        const CaptchaImage = await page.evaluate(() => {
            // Get the image of the captcha
            const image = document.getElementById("CaptchaImage");
            return image?.src;
        });

        if (!CaptchaImage) {
            console.log("Captcha image not found.");
            await browser.close();
            return false;
        }

        const CaptcaCodeBase64String = SaveBase64ImageOfCaptchaCode(CaptchaImage);
        const CaptcaCode = await ExtractCapchaCode(CaptcaCodeBase64String);
        console.log(`Captcha code: ${CaptcaCode}`);

        try {
            // Fill the required fields
            await page.type('#Username', Credentials.ID);
            await page.type('#password', Credentials.PASSWORD);
            await page.type('#CaptchaValue', CaptcaCode);

            // You might need a click event here if there's a submit button
            // Example: await Promise.all([
            //     page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 50000 }),
            //     page.click('your_submit_button_selector')
            // ]);

        } catch (error) {
            console.log("❌ Error filling fields:", error);
            await browser.close();
            return false;
        }

        try {
            // Wait for the dashboard to load after login
            await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });
            console.log("Dashboard loaded.");
        } catch (error) {
            console.log(`⌛ Dashboard did not load in time or Blackboard link not found: ${error.message}`);
            await browser.close();
            return false;
        }
    }  catch(err){
        console.log(`Error: ${err}`)
    }

}


async function StartScraping() {
    try {
    const status = await FetchNewAnouncmentsV2();
    console.log("Done! Success:", status);
    return status } catch {
        console.log("faliure during scraping process");
    }
}
 
module.exports = {StartScraping, passLoginPage};
  
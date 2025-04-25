
const fs = require("fs");

/**
 * - parse the capcha image element in the UI website
 * @param {*} base64Data : is in form "part0,acualimageendocdedstring,part2"
 * @param {*} filename 
 * @returns base64 string representaion of the capcha code image
 */
function SaveBase64ImageOfCaptchaCode(base64Data) {
    const base64 = base64Data.split(',')[1];
  
    // Convert base64 to buffer
    const buffer = Buffer.from(base64, 'base64');

    // Save the buffer to a file
    // i store the image for debugging purpose
    const filename = "./src/screenshots/Capcha.png"
    fs.writeFileSync(filename, buffer);

    // return the row endcoded string of the image
    return base64;
};

module.exports = {SaveBase64ImageOfCaptchaCode};


// any image processing via ai goes here

const {GeminiClient} = require("../../Clients/GeminiClient");

// photo that will be passed here is base64 string of the image
async function ExtractCapchaCode(photo) {
    const prompt = "i will send you a photo contain 5 digits number witch a little bit not clear, your task is \
    answere only with message contian the number( of 5 digits ) in the message no  text ony the number please i want it \
    to be accurate"
    const imagePart = {
        inlineData: {
          mimeType: 'image/png', // Use the correct type like 'image/jpeg' if needed
          data: photo
        }
      };
    const result = await GeminiClient.model.generateContent([
        imagePart,
        { text: prompt }
      ]);
    const response = await result.response;
    const CaptchaCode = response.text();
    return CaptchaCode
}

module.exports = {ExtractCapchaCode};

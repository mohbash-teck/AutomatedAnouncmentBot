
// gemini Client constructed here

const { GoogleGenerativeAI } = require("@google/generative-ai");
const {Gemini} = require("../config/AI");

class GeminiClientConstructor {
    constructor() {
        const ApiKey = Gemini.ApiToken || "MY_API_KEY";
        this.genAI = new GoogleGenerativeAI(ApiKey);
        this.model = this.genAI.getGenerativeModel({ model: Gemini.Model });
    }
};

GeminiClient = new GeminiClientConstructor();
module.exports = {GeminiClient};


// gemini Client constructed here

const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

// config the env variables
dotenv.config()

class GeminiClient {
    constructor() {
        const ApiKey = process.env.API_KEY || "MY_API_KEY";
        this.genAI = new GoogleGenerativeAI(ApiKey);
        this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    }
}

GeminiClient =GeminiClient()
modules.export = {GeminiClient}

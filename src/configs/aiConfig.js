const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAi = new GoogleGenerativeAI(process.env.CHATBOT_API_KEY);

const model = genAi.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

const sleep = (ms) => new Promise((resolve) => global.setTimeout(resolve, ms));

async function generateWithRetry(model, prompt) {
  try {
    return await model.generateContent(prompt);
  } catch (error) {
    if (error.status === 429) {
      // console.log("Rate limit hit. Waiting 40 sec...");

      await sleep(40000);

      return await model.generateContent(prompt);
    }

    throw error;
  }
}

module.exports = { model, generateWithRetry };

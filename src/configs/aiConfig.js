const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAi = new GoogleGenerativeAI(process.env.CHATBOT_API_KEY);

const model = genAi.getGenerativeModel({
  model: "gemini-2.5-flash",
});

module.exports = model;

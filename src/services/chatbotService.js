const { GoogleGenerativeAI } = require("@google/generative-ai");
const { env } = require("../configs/env");
const { InvalidRequestException } = require("../exceptions/appError");
// const { messageConstants } = require("../constants/messageConstants");
const chatbotRepository = require("../repositories/chatbotRepository");
const documentRepository = require("../repositories/documentRepository");
const { errorConstants } = require("../constants/errorConstants");
const genAi = new GoogleGenerativeAI(env.chatbotAPIKey);
const model = genAi.getGenerativeModel({
  model: "gemini-2.5-flash",
});
class chatbotService {
  async generateSummary(userId, docId) {
    console.log("documentId==", docId);
    const { documentId } = docId;
    const existingData = await documentRepository.findById(documentId);
    console.log("existingData===", existingData);

    if (!existingData || existingData.userId != userId)
      throw new InvalidRequestException(errorConstants.DOCUMENT_NOT_FOUND);
    const docData = existingData.ocrExtractedText;
    console.log("documentData===", docData);

    const prompt = `
        You are an AI healthcare assistant.

        Analyze the following medical report.
        and return it in valid JSON format
        Format:
            {
              "summary": "",
              "importantFindings": [],
              "simpleExplanation": []
            }
        Keep response simple and user friendly.
        Medical Report:
        ${docData}`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const cleanedResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsedResponse = JSON.parse(cleanedResponse);

    return chatbotRepository.createSummary({
      userId,
      aiSummaryData: parsedResponse,
    });
  }
}
module.exports = new chatbotService();

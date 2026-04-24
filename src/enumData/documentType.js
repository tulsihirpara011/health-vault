const documentType = Object.freeze({
  PRESCRIPTION: "PRESCRIPTION",
  LAB_REPORT: "LAB_REPORT",
  IMAGING_REPORT: "IMAGING_REPORT",
  DISCHARGE_SUMMARY: "DISCHARGE_SUMMARY",
  OTHER: "OTHER",
});

const documentTypeEnum = Object.values(documentType);
module.exports = { documentType, documentTypeEnum };
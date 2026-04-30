const fileType = Object.freeze({
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  JPEG: "image/jpeg",
  PDF: "application/pdf",
  PNG: "image/png",
  TXT: "text/plain",
});

const fileTypeValue = Object.values(fileType);

module.exports = {
  fileType,
  fileTypeValue,
};

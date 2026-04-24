const fileTypes = Object.freeze({
  PDF: "PDF",
  JPG: "JPG",
  JPEG: "JPEG",
  PNG: "PNG"
});

const FileTypesValues = Object.values(fileTypes);
module.exports = { fileTypes, FileTypesValues };
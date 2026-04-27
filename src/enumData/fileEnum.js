const fileEnum = Object.freeze({
   PDF:"application/pdf",
    JPEG:"image/jpeg",
    PNG:"image/png",
    DOC:"application/msword",
    DOCX:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    TXT:"text/plain",
});

const FileTypesValues = Object.values(fileEnum);
module.exports = { fileEnum, FileTypesValues };
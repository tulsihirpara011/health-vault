//middleaew for uplode files and check the file type and size
const GeneralResponse = require("../helpers/genralResponse");
const MessageConstant = require("../constant/messageConstant");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
});

// Validation middleware
const validateFile = (req, res, next) => {
  try {
    if (!req.file) {
      return GeneralResponse.badRequestResponse(
        res,
        MessageConstant.FILE_REQUIRED,
      );
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return GeneralResponse.badRequestResponse(
        res,
        MessageConstant.INVALID_FILE_TYPE,
      );
    }

    next();
  } catch (error) {
    console.error("File validation error:", error);

    return GeneralResponse.internalServerError(
      res,
      MessageConstant.SERVER_ERROR,
    );
  }
};

module.exports = {
  upload,
  validateFile,
};

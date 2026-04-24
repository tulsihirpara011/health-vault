const multer = require("multer");
const MessageConstant = require("../constant/messageConstant");
const GeneralResponse = require("../helpers/genralResponse");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return GeneralResponse.badRequest(res, MessageConstant.FILE_SIZE_ERROR);
    }
  }

  return GeneralResponse.badRequest(
    res,
    err.message || MessageConstant.BAD_REQUEST_ERROR,
  );
};

module.exports = errorHandler;

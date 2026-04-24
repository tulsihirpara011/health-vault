const S3Service = require("../services/s3Service");
const MessageConstant = require("../constant/messageConstant");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/aws");
const GeneralResponse = require("../helpers/genralResponse");
const messageConstant = require("../constant/messageConstant");
const { InternalServerError } = require("../excptions/ApiError");

class FileController {
  // Upload File
  async uploadFile(req, res, next) {
    try {
      const result = await S3Service.uploadFile(req.file);

      return GeneralResponse.created(
        res,
        result,
        MessageConstant.FILE_UPLOADED_SUCCESSFULLY,
      );
    } catch (error) {
      next(error);
    }
  }

  // Download File
  async getDownloadFile(req, res, next) {
    try {
      const { stream, fileName, contentType } = await S3Service.getDownloadUrl(
        req.query,
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`,
      );

      res.setHeader("Content-Type", contentType || "application/octet-stream");

      stream.pipe(res);
    } catch (error) {
      next(error);
    }
  }

  //delete file
  async deleteFile(req, res, next) {
    try {
      const { filekey } = req.query;

      if (!filekey) {
        throw new InvalidRequestException(MessageConstant.FILE_KEY_REQUIRED);
      }
      const result = await S3Service.deleteFile(filekey);
      return GeneralResponse.success(
        res,
        result,
        messageConstant.FILE_DELETED_SUCCESSFULLY,
      );
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new FileController();

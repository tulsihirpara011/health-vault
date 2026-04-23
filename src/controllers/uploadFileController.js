const S3Service = require("../services/s3Service");
const MessageConstant = require("../constant/messageConstant");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/aws");
const GeneralResponse = require("../helpers/genralResponse");

class FileController {
  // Upload File
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return GeneralResponse.badRequestResponse(
          res,
          MessageConstant.FILE_REQUIRED,
        );
      }

      const result = await S3Service.uploadFile(req.file, req.body.patientId);

      return GeneralResponse.createdResponse(
        res,
        result,
        MessageConstant.FILE_UPLOADED_SUCCESSFULLY,
      );
    } catch (error) {
      console.error("Error uploading file:", error);

      return GeneralResponse.internalServerError(
        res,
        MessageConstant.ERROR_UPLODED_FILE,
      );
    }
  }

  // Download File
  async getDownloadFile(req, res) {
    try {
      const { filekey } = req.query;

      if (!filekey) {
        return GeneralResponse.badRequestResponse(
          res,
          MessageConstant.FILE_KEY_REQUIRED,
        );
      }

      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: filekey,
      });

      const response = await s3Client.send(command);

      // download file with original filename
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filekey.split("/").pop()}"`,
      );

      res.setHeader(
        "Content-Type",
        response.ContentType || "application/octet-stream",
      );

      // Stream file directly
      response.Body.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);

      return GeneralResponse.internalServerError(
        res,
        MessageConstant.ERROR_GENERATING_DOWNLOAD_URL,
      );
    }
  }
}
module.exports = new FileController();

//aws sdk upload file to s3 bucket
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/aws");
const MessageConstant = require("../constant/messageConstant");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { InvalidRequestException } = require("../excptions/ApiError");
const messageConstant = require("../constant/messageConstant");
const doucumentRepository = require("../repositories/doucumentRepository");
const sessionRepository = require("../repositories/sessionRepository");
const JwtUtils = require("../utils/jwtUtils");
require("dotenv").config();

class S3Service {
  constructor() {
    this.bucket = process.env.AWS_BUCKET;
    this.region = process.env.AWS_REGION;
    this.folder="patient_Document";
  }

  // Upload file method
  async  uploadFile(file,sessionId) {
    try {
      if (!file) {
        throw new InvalidRequestException(MessageConstant.FILE_REQUIRED);
      }
        const decoded=sessionRepository.findById(sessionId);
        if (!sessionId) {
          throw new InvalidRequestException(MessageConstant.SESSION_NOT_FOUND);
        }
        const userId=decoded.userId;
      // folder structure
      const fileKey = `${this.folder}/${Date.now()}-${file.originalname}`;
      console.log("fileKey:", fileKey);
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      await s3Client.send(command);
      const documentData = {
      userId: userId,
      // documentType: data.documentType,
      fileName: file.originalname,
      fileStoragePath: fileKey,
      fileType: file.mimetype,
      fileSize: file.size,
    };
    console.log("DocumentData===",documentData);
      return await doucumentRepository.addDocument(documentData);
    } catch (error) {
      throw new InvalidRequestException(messageConstant.ERROR_UPLODED_FILE);
    }
  }

  //genrated download url (pre-signed)
  async getDownloadUrl(fileKey) {
    try {
      if (!fileKey) {
        throw new Error(MessageConstant.FILE_KEY_REQUIRED);
      }

      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      });
      const url = await getSignedUrl(s3Client, command, {
        expiresIn: process.env.SIGNED_URL_EXPIRY,
      }); //url valid for 10 minutes
      return url;
    } catch (error) {
      throw new Error(`Error generating download URL: ${error.message}`);
    }
  }
}

module.exports = new S3Service();

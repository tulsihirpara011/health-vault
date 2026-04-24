//aws sdk upload file to s3 bucket
const {
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/aws");
const MessageConstant = require("../constant/messageConstant");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();
const GeneralResponse = require("../helpers/genralResponse");
const {
  InvalidRequestException,
  InternalServerError,
} = require("../excptions/ApiError");

class S3Service {
  constructor() {
    this.bucket = process.env.AWS_BUCKET;
    this.region = process.env.AWS_REGION;
    this.folder = "patient_Document";
  }

  // Upload file method
  async uploadFile(file) {
    try {
      if (!file) {
        throw new InvalidRequestException(MessageConstant.FILE_IS_REQUIRED);
      }
      const fileKey = `${this.folder}/${Date.now()}-${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      await s3Client.send(command);
      return {
        fileKey,
      };
    } catch (error) {
      throw error;
    }
  }

  //genrated download url (pre-signed)
  async getDownloadUrl(fileKey) {
    try {
      if (!fileKey) {
        throw new InvalidRequestException(MessageConstant.FILE_KEY_REQUIRED);
      }
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      });
      const url = await getSignedUrl(s3Client, command, {
        expiresIn: process.env.SIGNED_URL_EXPIRY,
      });
      return { url };
    } catch (error) {
      throw error;
    }
  }

  //delete file from s3 bucket
  async deleteFile(filekey) {
    try {
      if (!filekey) {
        throw new Error(MessageConstant.FILE_KEY_REQUIRED);
      }
      //check if file exist in s3 bucket
      try {
        const headCommand = new HeadObjectCommand({
          Bucket: this.bucket,
          Key: filekey,
        });
        await s3Client.send(headCommand);
      } catch (error) {
        if (error.name === "NotFound") {
          throw new InvalidRequestException(MessageConstant.FILE_NOT_FOUND);
        }
        throw error;
      }

      //delete file from s3 bucket
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: filekey,
      });
      await s3Client.send(command);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new S3Service();

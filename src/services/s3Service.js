//aws sdk upload file to s3 bucket
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/aws");
const MessageConstant = require("../constant/messageConstant");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

class S3Service {
  constructor() {
    this.bucket = process.env.AWS_BUCKET;
    this.region = process.env.AWS_REGION;
  }

  // Upload file method
  async uploadFile(file) {
    try {
      if (!file) {
        throw new Error("File is required");
      }
      // folder structure
      const fileKey = `patients/${Date.now()}-${file.originalname}`;
      console.log("fileKey:", fileKey);

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
      throw new Error(`Error uploading file to S3: ${error.message}`);
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

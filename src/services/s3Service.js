//aws sdk upload file to s3 bucket
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/aws");

const uploadFileTos3 = async (file) => {
  try {
    //strong the file in s3 bucket with a unique key
    const filekey = `${Date.now()}-${file.originalname}`;
    console.log("fileKey:", filekey);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: filekey,
      Body: file.buffer, //set the file content from the buffer
      ContentType: file.mimetype, //set the content type of the file
    });
    await s3Client.send(command);
    //return the file url after successful upload
    const fileUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filekey}`;

    return { filekey, fileUrl };
  } catch (error) {
    throw new Error(`Error uploading file to S3: ${error.message}`);
  }
};
module.exports = {
  uploadFileTos3,
};

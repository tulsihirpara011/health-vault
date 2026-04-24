const { S3Client, HeadBucketCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

//create an s3 client instance
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  Credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

//function to check bucket connection
const checkS3BucketConnection = async () => {
  try {
    await s3Client.send(
      new HeadBucketCommand({
        Bucket: process.env.AWS_BUCKET,
      }),
    );
    console.log("Successfully connected to S3 bucket");
  } catch (error) {
    console.error("Error connecting to S3 bucket", error.message);
  }
};
module.exports = {
  checkS3BucketConnection,
  s3Client,
};

const express = require("express");
const router = express.Router();

const { upload, validateFile } = require("../middlerwares/upload");
const FileController = require("../controllers/uploadFileController");

//document upload in s3 bucket
router.post(
  "/upload",
  upload.single("file"),
  validateFile,
  FileController.uploadFile,
);

//download document from s3 bucket using file key
router.get("/download-url", FileController.getDownloadFile);

//delete document from s3 bucket using file key
router.delete("/delete", FileController.deleteFile);

module.exports = router;

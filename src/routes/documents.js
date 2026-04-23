const express = require("express");
const router = express.Router();

const { upload, validateFile } = require("../middlerwares/upload");
const FileController = require("../controllers/uploadFileController");

//document upload route
router.post(
  "/upload",
  upload.single("file"),
  validateFile,
  FileController.uploadFile,
);
//download document url
router.get("/download-url", FileController.getDownloadFile);

//
module.exports = router;

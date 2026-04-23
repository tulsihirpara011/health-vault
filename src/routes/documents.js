const express = require("express");
const router = express.Router();

const { uplode, validatedFile } = require("../middlerwares/upload");
const FileController = require("../controllers/uploadFileController");

//document upload route
router.post(
  "/upload",
  uplode.single("file"),
  validatedFile,
  FileController.uploadFile,
);
//download document url
router.get("/download-url", FileController.getDownloadFile);

//
module.exports = router;

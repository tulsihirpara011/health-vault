const express = require("express");
const router = express.Router();

const { uplode, validatedFile } = require("../middlerwares/upload");
const { uploadFileController } = require("../controllers/uploadFileController");

//document upload route
router.post(
  "/upload",
  uplode.single("file"), //expecting a single file with the field name "file"
  validatedFile, //validate the file type and size
  uploadFileController,
); //controller to handle the file upload logic

module.exports = router;

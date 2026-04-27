const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController.js");
const { upload, validateFile } = require("../middlerwares/upload");
const FileController = require("../controllers/uploadFileController");
const authMiddleware = require("../middlerwares/authMiddleware.js");

// router.post("/add", documentController.addDocument);
router.get("/list", documentController.getDocumentList);
router.get("/:id", documentController.getDocumentById);
router.delete("/:id", documentController.deleteDocument);
//download document url
router.get("/download-url", FileController.getDownloadFile);

//document upload route
router.post(
  "/upload",authMiddleware.auth,
  upload.single("file"),
  validateFile,
  FileController.uploadFile,
);


module.exports = router;

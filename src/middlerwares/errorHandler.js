const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // File too large
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds 25MB limit",
      });
    }
  }

  // Default error
  return res.status(400).json({
    success: false,
    message: err.message || "Something went wrong",
  });

  //other error
  return res.status(500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};
module.exports = errorHandler;

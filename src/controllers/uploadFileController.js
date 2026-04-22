const { uploadFileTos3 } = require("../services/s3Service");

const uploadFileController = async (req, res) => {
  try {
    const result = await uploadFileTos3(req.file);

    return res.status(200).json({
      success: true,
      message: "file uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
    });
  }
};

module.exports = {
  uploadFileController,
};

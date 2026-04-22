//middleaew for uplode files and check the file type and size

const multer = require("multer");

const uplode = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, //25 mb
});

//validation middleware for file type and size
const validatedFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploded" });
  }
  const allowesTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (!allowesTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ message: "Invalid file type" });
  }
  next();
};

module.exports = {
  uplode,
  validatedFile,
};

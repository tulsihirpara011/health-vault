const express = require("express");
const router = express.Router();

// import all route files
const sessionRoutes = require("./session");
const patientRoutes = require("./patientRoutes");
const documentRoutes = require("./documents");

// use routes
router.use("/session", sessionRoutes);
router.use("/patient", patientRoutes);
router.use("/documents", documentRoutes);

module.exports = router;

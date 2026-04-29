const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const { route } = require("./session");

router.post("/login", patientController.loginPatient);
router.post("/add", patientController.createPatient);

//forget-reset passwored
router.post("/forgot-password", patientController.forgotPassword);

// reset password
router.post("/reset-password", patientController.resetPassword);

// logout patient
router.post("/logout", patientController.logout);

router.get("/list", patientController.getPatientList);
router.get("/:id", patientController.getPatientById);
router.put("/:id", patientController.updatePatient);

router.delete("/soft-delete/:id", patientController.deletePatient);
router.delete("/hard-delete/:id", patientController.permanentDeletePatient);

module.exports = router;

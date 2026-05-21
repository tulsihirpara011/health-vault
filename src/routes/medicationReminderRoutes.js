const express = require("express");
const router = express.Router();
const controller = require("../controllers/medicationReminderController");
const { verifyToken } = require("../middlewares/authMiddleware");

// OCCURRENCE ACTIONS
router.post("/occurrences/:id/complete", verifyToken, controller.completeReminder);

router.post("/occurrences/:id/snooze", verifyToken, controller.snoozeReminder);

router.post("/occurrences/:id/skip", verifyToken, controller.skipReminder);

// LISTS
router.get("/today", verifyToken, controller.getTodayReminders);

router.get("/upcoming", verifyToken, controller.getUpcomingReminders);

router.get("/missed", verifyToken, controller.getMissedReminders);

router.get("/history", verifyToken, controller.getReminderHistory);

// REFILL
router.get("/refill-alerts", verifyToken, controller.getRefillAlerts);

// CONFIG
router.get("/config/:id", verifyToken, controller.getReminderConfig);

router.put("/config/:id", verifyToken, controller.updateReminderConfig);

router.delete("/config/:id", verifyToken, controller.deleteReminderConfig);

module.exports = router;

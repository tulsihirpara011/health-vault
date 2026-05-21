const medicationReminderService = require("../services/medicationReminderService");
const { successResponse } = require("../helpers/generalResponse");
const { messageConstants } = require("../constants/messageConstants");

// COMPLETE REMINDER OCCURRENCE
async function completeReminder(req, res) {
  const occurrenceId = req.params.id;
  const userId = req.auth.userId;
  const result = await medicationReminderService.completeReminder(occurrenceId, userId);
  return successResponse(res, result, messageConstants.REMINDER_COMPLETED);
}

// SNOOZE REMINDER OCCURRENCE
async function snoozeReminder(req, res) {
  const occurrenceId = req.params.id;
  const userId = req.auth.userId;
  const result = await medicationReminderService.snoozeReminder(occurrenceId, req.body, userId);
  return successResponse(res, result, messageConstants.REMINDER_SNOOZED);
}

// SKIP REMINDER OCCURRENCE
async function skipReminder(req, res) {
  const occurrenceId = req.params.id;
  const userId = req.auth.userId;
  const result = await medicationReminderService.skipReminder(occurrenceId, userId);
  return successResponse(res, result, messageConstants.REMINDER_SKIPPED);
}

// GET TODAY REMINDERS
async function getTodayReminders(req, res) {
  const userId = req.auth.userId;
  const result = await medicationReminderService.getTodayReminders(userId);
  return successResponse(res, result, messageConstants.REMINDER_LIST_FETCHED);
}

// GET UPCOMING REMINDERS
async function getUpcomingReminders(req, res) {
  const userId = req.auth.userId;

  const result = await medicationReminderService.getUpcomingReminders(userId);

  return successResponse(res, result, messageConstants.REMINDER_LIST_FETCHED);
}

// GET MISSED REMINDERS
async function getMissedReminders(req, res) {
  const userId = req.auth.userId;
  const result = await medicationReminderService.getMissedReminders(userId);
  return successResponse(res, result, messageConstants.REMINDER_LIST_FETCHED);
}

// GET REMINDER HISTORY
async function getReminderHistory(req, res) {
  const userId = req.auth.userId;
  const result = await medicationReminderService.getReminderHistory(userId);
  return successResponse(res, result, messageConstants.REMINDER_LIST_FETCHED);
}

// GET REFILL ALERTS
async function getRefillAlerts(req, res) {
  const userId = req.auth.userId;
  const result = await medicationReminderService.getRefillAlerts(userId);
  return successResponse(res, result, messageConstants.REMINDER_LIST_FETCHED);
}

// GET REMINDER CONFIG
async function getReminderConfig(req, res) {
  const reminderConfigId = req.params.id;
  const userId = req.auth.userId;
  const result = await medicationReminderService.getReminderConfig(reminderConfigId, userId);
  return successResponse(res, result, messageConstants.REMINDER_FETCHED);
}

// UPDATE REMINDER CONFIG
async function updateReminderConfig(req, res) {
  const reminderConfigId = req.params.id;
  const userId = req.auth.userId;
  const result = await medicationReminderService.updateReminderConfig(
    reminderConfigId,
    req.body,
    userId,
  );

  return successResponse(res, result, messageConstants.REMINDER_UPDATED);
}

// DELETE REMINDER CONFIG
async function deleteReminderConfig(req, res) {
  const reminderConfigId = req.params.id;
  const userId = req.auth.userId;
  const result = await medicationReminderService.deleteReminderConfig(reminderConfigId, userId);
  return successResponse(res, result, messageConstants.REMINDER_DELETED);
}

module.exports = {
  completeReminder,
  snoozeReminder,
  skipReminder,
  getTodayReminders,
  getUpcomingReminders,
  getMissedReminders,
  getReminderHistory,
  getRefillAlerts,
  getReminderConfig,
  updateReminderConfig,
  deleteReminderConfig,
};

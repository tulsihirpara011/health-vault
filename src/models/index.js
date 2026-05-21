const { document } = require("./document");
const { notification } = require("./notification");
const { patient } = require("./patient");
const { session } = require("./session");
const { medication } = require("./medication");
const { medicationReminder } = require("./medicationReminder");
const { medicationReminderOccurrence } = require("./medicrionReminderOccurrences");

module.exports = {
  document,
  medication,
  notification,
  patient,
  session,
  medicationReminder,
  medicationReminderOccurrence,
};

const reminderStatusType = Object.freeze({
  PENDING: "PENDING",
  SENT: "SENT",
  COMPLETED: "COMPLETED",
  MISSED: "MISSED",
  SKIPPED: "SKIPPED",
  SNOOZED: "SNOOZED",
});

const reminderStatusValues = Object.values(reminderStatusType);

module.exports = {
  reminderStatusType,
  reminderStatusValues,
};

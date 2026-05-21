const reminderType = Object.freeze({
  BEFORE_MEDICATION: "BEFORE_MEDICATION",
  AFTER_MEDICATION: "AFTER_MEDICATION",
  MISSED_CHECK: "MISSED_CHECK",
  REFILL_ALERT: "REFILL_ALERT",
});

const reminderTypeValues = Object.values(reminderType);

module.exports = {
  reminderType,
  reminderTypeValues,
};

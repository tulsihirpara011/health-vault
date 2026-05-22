const reminderOccurrenceType = Object.freeze({
  DOSE: "DOSE",
  REFILL_ALERT: "REFILL_ALERT",
});

const reminderOccurrenceTypeValues = Object.values(reminderOccurrenceType);

module.exports = {
  reminderOccurrenceType,
  reminderOccurrenceTypeValues,
};

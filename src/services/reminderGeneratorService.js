const medicationReminderOccurrenceRepository = require("../repositories/medicationReminderOccurrenceRepository");

class ReminderGeneratorService {
  async generateOccurrences({ reminder, medication }) {
    const occurrences = [];
    const medicationTimes = medication.medicationTimes;

    for (const time of medicationTimes) {
      const medicationDateTime = new Date(time);

      // BEFORE
      const beforeTime = new Date(
        medicationDateTime.getTime() - reminder.reminderBeforeMinutes * 60000,
      );

      occurrences.push({
        reminderId: reminder.id,
        type: "BEFORE_MEDICATION",
        scheduledAt: beforeTime,
      });

      // AFTER
      const afterTime = new Date(
        medicationDateTime.getTime() + reminder.afterReminderMinutes * 60000,
      );
      occurrences.push({
        reminderId: reminder.id,
        type: "AFTER_MEDICATION",
        scheduledAt: afterTime,
      });
    }

    // refill alert
    const refillDate = new Date(medication.endDate);
    refillDate.setDate(refillDate.getDate() - reminder.refillAlertBeforeDays);
    occurrences.push({
      reminderId: reminder.id,
      type: "REFILL_ALERT",
      scheduledAt: refillDate,
    });

    return medicationReminderOccurrenceRepository.bulkCreate(occurrences);
  }
}

module.exports = new ReminderGeneratorService();

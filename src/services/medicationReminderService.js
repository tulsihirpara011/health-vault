const occurrenceRepository = require("../repositories/medicationReminderOccurrenceRepository");
const medicationRepository = require("../repositories/medicationRepository");
const medicationReminderRepository = require("../repositories/medicationReminderRepository");

class MedicationReminderService {
  // COMPLETE REMINDER
  async completeReminder(occurrenceId, userId) {
    const occurrence = await occurrenceRepository.findById(occurrenceId, userId);

    if (!occurrence) {
      throw new Error("Reminder occurrence not found");
    }

    const updatedOccurrence = await occurrenceRepository.updateById(
      occurrenceId,
      {
        status: "COMPLETED",
        completedAt: new Date(),
      },
      userId,
    );

    const medication = await medicationRepository.findById(occurrence.medicationId, userId);

    if (medication) {
      const remainingQuantity = Math.max(
        0,
        medication.remainingQuantity - medication.dosePerIntake,
      );

      await medicationRepository.updateById(
        medication.id,
        {
          remainingQuantity,
        },
        userId,
      );
    }

    return updatedOccurrence;
  }

  // SNOOZE REMINDER
  async snoozeReminder(occurrenceId, payload, userId) {
    const occurrence = await occurrenceRepository.findById(occurrenceId, userId);

    if (!occurrence) {
      throw new Error("Reminder occurrence not found");
    }

    const { snoozeUntil } = payload;

    return occurrenceRepository.updateById(
      occurrenceId,
      {
        status: "SNOOZED",
        snoozeUntil,
      },
      userId,
    );
  }

  // SKIP REMINDER
  async skipReminder(occurrenceId, userId) {
    const occurrence = await occurrenceRepository.findById(occurrenceId, userId);

    if (!occurrence) {
      throw new Error("Reminder occurrence not found");
    }

    return occurrenceRepository.updateById(
      occurrenceId,
      {
        status: "SKIPPED",
      },
      userId,
    );
  }

  // TODAY REMINDERS
  async getTodayReminders(userId) {
    return occurrenceRepository.findToday(userId);
  }

  // UPCOMING REMINDERS
  async getUpcomingReminders(userId) {
    return occurrenceRepository.findUpcoming(userId);
  }

  // MISSED REMINDERS
  async getMissedReminders(userId) {
    return occurrenceRepository.findMissed(userId);
  }

  // REMINDER HISTORY
  async getReminderHistory(userId) {
    return occurrenceRepository.findHistory(userId);
  }

  // REFILL ALERTS
  async getRefillAlerts(userId) {
    return occurrenceRepository.findRefillAlerts(userId);
  }

  // GET REMINDER CONFIG
  async getReminderConfig(id, userId) {
    return medicationReminderRepository.findById(id, userId);
  }

  // UPDATE REMINDER CONFIG
  async updateReminderConfig(id, payload, userId) {
    return medicationReminderRepository.updateById(id, payload, userId);
  }

  // DELETE REMINDER CONFIG
  async deleteReminderConfig(id, userId) {
    return medicationReminderRepository.deleteById(id, userId);
  }
}

module.exports = new MedicationReminderService();

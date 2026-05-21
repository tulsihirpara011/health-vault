const { and, eq, sql, lt } = require("drizzle-orm");
const { db } = require("../configs/db");
const { medicationReminderOccurrence } = require("../models/medicrionReminderOccurrences");

class MedicationReminderOccurrenceRepository {
  // BULK CREATE
  async bulkCreate(payload) {
    return db.insert(medicationReminderOccurrence).values(payload).returning();
  }

  // FIND BY ID
  async findById(id, userId) {
    const result = await db
      .select()
      .from(medicationReminderOccurrence)
      .where(
        and(
          eq(medicationReminderOccurrence.id, id),
          eq(medicationReminderOccurrence.patientId, userId),
        ),
      )
      .limit(1);

    return result[0] || null;
  }

  // UPDATE BY ID
  async updateById(id, payload, userId) {
    const result = await db
      .update(medicationReminderOccurrence)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(medicationReminderOccurrence.id, id),
          eq(medicationReminderOccurrence.patientId, userId),
        ),
      )
      .returning();

    return result[0] || null;
  }

  // FIND DUE REMINDERS
  async findDueReminders() {
    return db
      .select()
      .from(medicationReminderOccurrence)
      .where(
        and(
          eq(medicationReminderOccurrence.status, "PENDING"),
          eq(medicationReminderOccurrence.notificationSent, false),
          sql`${medicationReminderOccurrence.scheduledAt} <= NOW()`,
        ),
      );
  }

  // FIND MISSED REMINDERS
  async findMissedReminders() {
    return db
      .select()
      .from(medicationReminderOccurrence)
      .where(
        and(
          eq(medicationReminderOccurrence.status, "SENT"),
          lt(medicationReminderOccurrence.scheduledAt, new Date(Date.now() - 30 * 60 * 1000)),
        ),
      );
  }

  // TODAY REMINDERS
  async findToday(userId) {
    return db
      .select()
      .from(medicationReminderOccurrence)
      .where(
        and(
          eq(medicationReminderOccurrence.patientId, userId),
          sql`DATE(${medicationReminderOccurrence.scheduledAt}) = CURRENT_DATE`,
        ),
      );
  }

  // UPCOMING REMINDERS
  async findUpcoming(userId) {
    return db
      .select()
      .from(medicationReminderOccurrence)
      .where(
        and(
          eq(medicationReminderOccurrence.patientId, userId),
          sql`${medicationReminderOccurrence.scheduledAt} > NOW()`,
        ),
      );
  }

  // MISSED REMINDERS
  async findMissed(userId) {
    return db
      .select()
      .from(medicationReminderOccurrence)
      .where(
        and(
          eq(medicationReminderOccurrence.patientId, userId),
          eq(medicationReminderOccurrence.status, "MISSED"),
        ),
      );
  }

  // HISTORY
  async findHistory(userId) {
    return db
      .select()
      .from(medicationReminderOccurrence)
      .where(
        and(
          eq(medicationReminderOccurrence.patientId, userId),
          sql`${medicationReminderOccurrence.status} IN ('COMPLETED', 'MISSED', 'SKIPPED')`,
        ),
      );
  }

  // REFILL ALERTS
  async findRefillAlerts(userId) {
    return db
      .select()
      .from(medicationReminderOccurrence)
      .where(
        and(
          eq(medicationReminderOccurrence.patientId, userId),
          eq(medicationReminderOccurrence.type, "REFILL_ALERT"),
        ),
      );
  }
}

module.exports = new MedicationReminderOccurrenceRepository();

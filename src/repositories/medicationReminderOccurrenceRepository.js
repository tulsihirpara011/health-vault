const { and, eq, sql, lt } = require("drizzle-orm");
const { db } = require("../configs/db");
const { medicationReminderOccurrence } = require("../models/medicrionReminderOccurrences");

class MedicationReminderOccurrenceRepository {
  // VALID DATE CHECK
  isValidDate(d) {
    return d instanceof Date && !isNaN(d.getTime());
  }

  // BULK CREATE
  async bulkCreate(payload) {
    try {
      if (!Array.isArray(payload)) {
        throw new Error("Payload must be an array");
      }

      const safePayload = payload
        .map((p) => {
          const scheduledAt = new Date(p.scheduledAt);

          const createdAt = p.createdAt ? new Date(p.createdAt) : new Date();

          const updatedAt = p.updatedAt ? new Date(p.updatedAt) : new Date();

          return {
            ...p,

            scheduledAt: this.isValidDate(scheduledAt) ? scheduledAt : null,

            createdAt: this.isValidDate(createdAt) ? createdAt : new Date(),

            updatedAt: this.isValidDate(updatedAt) ? updatedAt : new Date(),
          };
        })
        .filter((p) => p.scheduledAt !== null);

      // DEBUG
      if (safePayload.length !== payload.length) {
        console.log(`⚠️ Filtered invalid occurrences: ${payload.length - safePayload.length}`);
      }

      if (safePayload.length === 0) {
        console.log("⚠️ No valid occurrences to insert");
        return [];
      }

      return await db.insert(medicationReminderOccurrence).values(safePayload).returning();
    } catch (error) {
      console.error("❌ bulkCreate error:", error.message);
      throw error;
    }
  }

  // FIND BY ID
  async findById(id) {
    const result = await db
      .select()
      .from(medicationReminderOccurrence)
      .where(
        and(
          eq(medicationReminderOccurrence.id, id),

          eq(medicationReminderOccurrence.softDelete, false),
        ),
      )
      .limit(1);

    return result[0] || null;
  }

  // UPDATE BY ID
  async updateById(id, payload) {
    const result = await db
      .update(medicationReminderOccurrence)
      .set({
        ...payload,

        updatedAt: new Date(),
      })
      .where(
        and(
          eq(medicationReminderOccurrence.id, id),

          eq(medicationReminderOccurrence.softDelete, false),
        ),
      )
      .returning();

    return result[0] || null;
  }

  // COMPLETE REMINDER
  async completeReminder(id) {
    const result = await db
      .update(medicationReminderOccurrence)
      .set({
        status: "COMPLETED",

        completedAt: new Date(),

        updatedAt: new Date(),
      })
      .where(
        and(
          eq(medicationReminderOccurrence.id, id),

          eq(medicationReminderOccurrence.softDelete, false),
        ),
      )
      .returning();

    return result[0] || null;
  }

  // SKIP REMINDER
  async skipReminder(id) {
    const result = await db
      .update(medicationReminderOccurrence)
      .set({
        status: "SKIPPED",

        updatedAt: new Date(),
      })
      .where(
        and(
          eq(medicationReminderOccurrence.id, id),

          eq(medicationReminderOccurrence.softDelete, false),
        ),
      )
      .returning();

    return result[0] || null;
  }

  // SNOOZE REMINDER
  async snoozeReminder(id, snoozeUntil) {
    const result = await db
      .update(medicationReminderOccurrence)
      .set({
        status: "PENDING",

        scheduledAt: snoozeUntil,

        notificationSent: false,

        sentAt: null,

        updatedAt: new Date(),
      })
      .where(
        and(
          eq(medicationReminderOccurrence.id, id),

          eq(medicationReminderOccurrence.softDelete, false),
        ),
      )
      .returning();

    return result[0] || null;
  }

  // DUE REMINDERS
  async findDueReminders() {
    return db
      .select()
      .from(medicationReminderOccurrence)
      .where(
        and(
          eq(medicationReminderOccurrence.status, "PENDING"),

          eq(medicationReminderOccurrence.notificationSent, false),

          sql`${medicationReminderOccurrence.scheduledAt} <= NOW()`,

          eq(medicationReminderOccurrence.softDelete, false),
        ),
      )
      .orderBy(medicationReminderOccurrence.scheduledAt);
  }

  // MISSED REMINDERS (SYSTEM CHECK)
  async findMissedReminders() {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    return db
      .select()
      .from(medicationReminderOccurrence)
      .where(
        and(
          eq(medicationReminderOccurrence.status, "SENT"),

          lt(medicationReminderOccurrence.scheduledAt, thirtyMinutesAgo),

          eq(medicationReminderOccurrence.softDelete, false),
        ),
      )
      .orderBy(medicationReminderOccurrence.scheduledAt);
  }

  // TODAY REMINDERS
  async findToday() {
    return db
      .select()
      .from(medicationReminderOccurrence)
      .where(
        and(
          eq(medicationReminderOccurrence.softDelete, false),

          sql`DATE(${medicationReminderOccurrence.scheduledAt}) = CURRENT_DATE`,
        ),
      )
      .orderBy(medicationReminderOccurrence.scheduledAt);
  }

  // UPCOMING REMINDERS
  async findUpcoming() {
    return db
      .select()
      .from(medicationReminderOccurrence)
      .where(
        and(
          eq(medicationReminderOccurrence.softDelete, false),

          sql`${medicationReminderOccurrence.scheduledAt} > NOW()`,
        ),
      )
      .orderBy(medicationReminderOccurrence.scheduledAt);
  }

  // MISSED REMINDERS (USER VIEW)
  async findMissed() {
    return db
      .select()
      .from(medicationReminderOccurrence)
      .where(
        and(
          eq(medicationReminderOccurrence.softDelete, false),

          eq(medicationReminderOccurrence.status, "MISSED"),
        ),
      )
      .orderBy(sql`${medicationReminderOccurrence.updatedAt} DESC`);
  }

  // HISTORY
  async findHistory() {
    return db
      .select()
      .from(medicationReminderOccurrence)
      .where(
        and(
          eq(medicationReminderOccurrence.softDelete, false),

          sql`${medicationReminderOccurrence.status} IN ('COMPLETED', 'MISSED', 'SKIPPED')`,
        ),
      )
      .orderBy(sql`${medicationReminderOccurrence.updatedAt} DESC`);
  }

  // REFILL ALERTS
  async findRefillAlerts() {
    return db
      .select()
      .from(medicationReminderOccurrence)
      .where(
        and(
          eq(medicationReminderOccurrence.softDelete, false),

          eq(medicationReminderOccurrence.type, "REFILL_ALERT"),
        ),
      )
      .orderBy(medicationReminderOccurrence.scheduledAt);
  }
}

module.exports = new MedicationReminderOccurrenceRepository();

const { and, eq } = require("drizzle-orm");
const { db } = require("../configs/db");
const { medicationReminder } = require("../models/medicationReminder");

class MedicationReminderRepository {
  // CREATE
  async create(data) {
    const result = await db.insert(medicationReminder).values(data).returning();

    return result[0] || null;
  }

  // BULK CREATE
  async bulkCreate(data) {
    return db.insert(medicationReminder).values(data).returning();
  }

  // FIND BY ID
  async findById(id, userId) {
    const result = await db
      .select()
      .from(medicationReminder)
      .where(and(eq(medicationReminder.id, id), eq(medicationReminder.patientId, userId)))
      .limit(1);

    return result[0] || null;
  }

  // UPDATE BY ID
  async updateById(id, payload, userId) {
    const result = await db
      .update(medicationReminder)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(and(eq(medicationReminder.id, id), eq(medicationReminder.patientId, userId)))
      .returning();

    return result[0] || null;
  }

  // DELETE BY ID
  async deleteById(id, userId) {
    const result = await db
      .delete(medicationReminder)
      .where(and(eq(medicationReminder.id, id), eq(medicationReminder.patientId, userId)))
      .returning();

    return result[0] || null;
  }
}

module.exports = new MedicationReminderRepository();

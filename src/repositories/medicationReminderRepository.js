const { and, eq } = require("drizzle-orm");
const { db } = require("../configs/db");
const { medicationReminder } = require("../models/medicationReminder");

class MedicationReminderRepository {
  // CREATE
  async create(data) {
    const result = await db
      .insert(medicationReminder)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result[0] || null;
  }

  // BULK CREATE
  async bulkCreate(data) {
    if (!Array.isArray(data)) {
      throw new Error("Payload must be an array");
    }

    const payload = data.map((item) => ({
      ...item,
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),

      updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    }));

    return db.insert(medicationReminder).values(payload).returning();
  }

  // FIND BY ID
  async findById(id, userId) {
    console.log("FIND ID:", id);
    console.log("FIND USER ID:", userId);

    const result = await db
      .select()
      .from(medicationReminder)
      .where(
        and(
          eq(medicationReminder.id, id),

          eq(medicationReminder.patientId, userId),

          eq(medicationReminder.softDelete, false),
        ),
      )
      .limit(1);

    console.log("FIND RESULT:", result);

    return result[0] || null;
  }

  // UPDATE BY ID
  async updateById(id, payload, userId) {
    console.log("UPDATE ID:", id);
    console.log("UPDATE USER ID:", userId);

    // CHECK EXISTING RECORD
    const existing = await db
      .select()
      .from(medicationReminder)
      .where(
        and(
          eq(medicationReminder.id, id),

          eq(medicationReminder.softDelete, false),
        ),
      )
      .limit(1);

    console.log("EXISTING RECORD:", existing);

    // UPDATE
    const result = await db
      .update(medicationReminder)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(medicationReminder.id, id),

          eq(medicationReminder.patientId, userId),

          eq(medicationReminder.softDelete, false),
        ),
      )
      .returning();

    console.log("UPDATED RESULT:", result);

    return result[0] || null;
  }

  // SOFT DELETE
  async deleteById(id, userId) {
    console.log("DELETE ID:", id);
    console.log("DELETE USER ID:", userId);

    const result = await db
      .update(medicationReminder)
      .set({
        softDelete: true,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(medicationReminder.id, id),

          eq(medicationReminder.patientId, userId),

          eq(medicationReminder.softDelete, false),
        ),
      )
      .returning();

    console.log("DELETE RESULT:", result);

    return result[0] || null;
  }

  // FIND ALL USER REMINDERS
  async findAll(userId) {
    console.log("FIND ALL USER ID:", userId);

    const result = await db
      .select()
      .from(medicationReminder)
      .where(
        and(
          eq(medicationReminder.patientId, userId),

          eq(medicationReminder.softDelete, false),
        ),
      );

    console.log("FIND ALL RESULT:", result);

    return result;
  }
}

module.exports = new MedicationReminderRepository();

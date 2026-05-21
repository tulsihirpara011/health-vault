const {
  pgTable,
  uuid,
  timestamp,
  integer,
  varchar,
  boolean,
  pgEnum,
  index,
  json,
} = require("drizzle-orm/pg-core");

const { medication } = require("./medication");
const { patient } = require("./patient");
const { reminderTypeValues } = require("../enums/reminderType");
const { frequencyTypeValues } = require("../enums/frequencyType");
const reminderTypeEnum = pgEnum("reminder_type", reminderTypeValues);
const frequencyEnum = pgEnum("frequency_type", frequencyTypeValues);
const medicationReminder = pgTable(
  "medication_reminders",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    patientId: uuid("patient_id")
      .references(() => patient.id)
      .notNull(),

    medicationId: uuid("medication_id")
      .references(() => medication.id)
      .notNull(),

    type: reminderTypeEnum("type").notNull(),

    reminderBeforeMinutes: integer("reminder_before_minutes").default(5).notNull(),

    afterReminderMinutes: integer("after_reminder_minutes").default(10).notNull(),

    dosePerIntake: integer("dose_per_intake"),

    frequency: frequencyEnum("frequency").notNull(),

    medicationTime: json("medication_times"),
    bestTaken: varchar("best_taken", {
      length: 50,
    }).array(),

    refillAlertBeforeDays: integer("refill_alert_before_days").default(1).notNull(),

    timezone: varchar("timezone", { length: 100 }).default("Asia/Kolkata").notNull(),

    active: boolean("active").default(true).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    softDelete: boolean("soft_delete").default(false).notNull(),
  },

  (table) => [
    index("medication_reminders_patient_idx").on(table.patientId),

    index("medication_reminders_medication_idx").on(table.medicationId),

    index("medication_reminders_type_idx").on(table.type),
  ],
);

module.exports = {
  medicationReminder,
  reminderTypeEnum,
};

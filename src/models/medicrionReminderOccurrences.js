const {
  pgTable,
  uuid,
  timestamp,
  varchar,
  boolean,
  pgEnum,
  index,
} = require("drizzle-orm/pg-core");

const { medicationReminder } = require("./medicationReminder");
const { reminderTypeValues } = require("../enums/reminderType");
const { reminderStatusValues } = require("../enums/reminderStatus");
const occurrenceStatusEnum = pgEnum("occurrence_status", reminderStatusValues);
const occurrenceTypeEnum = pgEnum("occurrence_type", reminderTypeValues);

const medicationReminderOccurrence = pgTable(
  "medication_reminder_occurrences",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    reminderId: uuid("reminder_id")
      .references(() => medicationReminder.id, {
        onDelete: "cascade",
      })
      .notNull(),

    type: occurrenceTypeEnum("type").notNull(),

    status: occurrenceStatusEnum("status").default("PENDING").notNull(),

    scheduledAt: timestamp("scheduled_at", {
      withTimezone: true,
    }).notNull(),

    sentAt: timestamp("sent_at", {
      withTimezone: true,
    }),

    completedAt: timestamp("completed_at", {
      withTimezone: true,
    }),

    snoozeUntil: timestamp("snooze_until", {
      withTimezone: true,
    }),

    notificationSent: boolean("notification_sent").default(false).notNull(),

    responseMessage: varchar("response_message", {
      length: 255,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

    softDelete: boolean("soft_delete").default(false).notNull(),
  },

  (table) => [
    index("occurrence_reminder_idx").on(table.reminderId),

    index("occurrence_status_idx").on(table.status),

    index("occurrence_schedule_idx").on(table.scheduledAt),

    index("occurrence_type_idx").on(table.type),
  ],
);

module.exports = {
  medicationReminderOccurrence,
  occurrenceStatusEnum,
  occurrenceTypeEnum,
};

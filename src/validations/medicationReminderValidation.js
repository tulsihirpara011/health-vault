const { z } = require("zod");
const { errorConstants } = require("../constants/errorConstants");
const { reminderStatusValues } = require("../enums/reminderStatus");
const { foodTypeValues } = require("../enums/foodType");
const { reminderTypeValues } = require("../enums/reminderType");

// COMMON FIELDS
const uuidField = z.string().uuid(errorConstants.INVALID_ID);

const scheduledAtField = z.coerce.date({
  required_error: errorConstants.DATE_REQUIRED,

  invalid_type_error: errorConstants.INVALID_DATE,
});

// OCCURRENCE PARAM SCHEMA
const occurrenceParamSchema = z
  .object({
    id: uuidField,
  })
  .strict();

// CREATE REMINDER CONFIG SCHEMA
const createMedicationReminderSchema = z
  .object({
    patientId: uuidField,
    medicationId: uuidField,
    foodType: z.enum(foodTypeValues, {
      required_error: errorConstants.FOOD_TYPE_REQUIRED,
    }),
    type: z.enum(reminderTypeValues).default("BEFORE_MEDICATION"),
    refillAlertBeforeDays: z.coerce.number().int().min(1).default(1),
    status: z.enum(reminderStatusValues).optional(),
    scheduledAt: scheduledAtField,
    timezone: z.string().trim().max(100).optional(),
    responseMessage: z.string().trim().max(255).optional().nullable(),
  })
  .strict();

// UPDATE REMINDER CONFIG SCHEMA
const updateMedicationReminderSchema = z
  .object({
    foodType: z.enum(foodTypeValues).optional(),
    type: z.enum(reminderTypeValues).optional(),
    refillAlertBeforeDays: z.coerce.number().int().min(1).optional(),
    status: z.enum(reminderStatusValues).optional(),
    scheduledAt: scheduledAtField.optional(),
    notificationSent: z.boolean().optional(),
    completedAt: z.coerce.date().optional(),
    snoozeUntil: z.coerce.date().optional(),
    timezone: z.string().trim().max(100).optional(),
    responseMessage: z.string().trim().max(255).optional().nullable(),
  })
  .strict();

// SNOOZE REMINDER OCCURRENCE SCHEMA
const snoozeReminderSchema = z
  .object({
    snoozeUntil: z.coerce.date({
      required_error: errorConstants.DATE_REQUIRED,
      invalid_type_error: errorConstants.INVALID_DATE,
    }),
  })
  .strict();

// LIST QUERY SCHEMA
const listMedicationReminderQuerySchema = z
  .object({
    filter: z
      .object({
        status: z.enum(reminderStatusValues).optional(),
        medicationId: uuidField.optional(),
        type: z.enum(reminderTypeValues).optional(),
        search: z.string().trim().optional(),
      })
      .optional(),

    sort: z
      .object({
        sortBy: z.enum(["createdAt", "scheduledAt", "status", "updatedAt"]).default("scheduledAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
      .optional(),

    page: z
      .object({
        pageNumber: z.coerce.number().int().min(1).default(1),
        pageLimit: z.coerce.number().int().min(1).max(100).default(10),
      })
      .optional(),
  })
  .strict();

module.exports = {
  createMedicationReminderSchema,
  updateMedicationReminderSchema,
  snoozeReminderSchema,
  listMedicationReminderQuerySchema,
  occurrenceParamSchema,
};

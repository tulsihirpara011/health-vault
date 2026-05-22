const { errorConstants } = require("../constants/errorConstants");
const { NotFoundException } = require("../exceptions/appError");
const medicationRepository = require("../repositories/medicationRepository");
const patientRepository = require("../repositories/patientRepository");
const medicationReminderRepository = require("../repositories/medicationReminderRepository");
const medicationReminderOccurrenceRepository = require("../repositories/medicationReminderOccurrenceRepository");

const { generateReminderTimes } = require("../utils/reminderGenerator");

const {
  createMedicationSchema,
  updateMedicationSchema,
  listMedicationQuerySchema,
  validateSchema,
} = require("../validations");

const { calculateMedicationValues } = require("../utils/medicationCalculation");

class MedicationService {
  // CREATE MEDICATION
  async createMedication(userId, payload) {
    const validData = await validateSchema(createMedicationSchema, payload);

    // CHECK PATIENT
    const patient = await patientRepository.findById(userId);

    if (!patient) {
      throw new NotFoundException(errorConstants.PATIENT_NOT_FOUND);
    }

    // NORMALIZE START DATE
    const startDate = validData.startDate ? new Date(validData.startDate) : null;

    if (!startDate || isNaN(startDate.getTime())) {
      throw new Error("Invalid startDate");
    }

    // CALCULATE VALUES
    const { endDate, remainingQuantity, dailyConsumption } = calculateMedicationValues({
      ...validData,
      startDate,
    });

    const safeEndDate = endDate ? new Date(endDate) : null;

    if (safeEndDate && isNaN(safeEndDate.getTime())) {
      throw new Error("Invalid endDate");
    }

    // CREATE MEDICATION
    const createdMedication = await medicationRepository.create({
      userId,
      patientCode: patient.patientCode,
      medicationName: validData.medicationName,
      medicationType: validData.medicationType,
      prescribedBy: validData.prescribedBy,
      dosePerIntake: validData.dosePerIntake,
      frequency: validData.frequency,
      medicationTime: validData.medicationTime,
      bestTaken: validData.bestTaken,
      foodFrequency: validData.foodFrequency,
      startDate,
      totalQuantity: validData.totalQuantity,
      notes: validData.notes,
      endDate: safeEndDate,
      unit: validData.unit,
      remainingQuantity,
      dailyConsumption,
    });

    // CREATE MAIN REMINDER
    const createdReminder = await medicationReminderRepository.create({
      patientId: userId,
      medicationId: createdMedication.id,
      type: "AFTER_MEDICATION",
      frequency: validData.frequency,
      medicationTime: validData.medicationTime,
      bestTaken: validData.bestTaken,
      dosePerIntake: validData.dosePerIntake,
    });

    // GENERATE REMINDER TIMES
    let reminderTimes = [];

    try {
      reminderTimes = generateReminderTimes({
        id: createdReminder.id,
        userId,

        medicationTime: validData.medicationTime,

        startDate,
        endDate: safeEndDate,

        foodFrequency: validData.foodFrequency,
      });
    } catch (err) {
      console.error("Reminder generation failed:", err.message);
      reminderTimes = [];
    }

    // CREATE OCCURRENCES
    const occurrences = reminderTimes.map((reminder) => ({
      reminderId: createdReminder.id,
      type: reminder.type || "AFTER_MEDICATION",
      status: "PENDING",
      scheduledAt: reminder.scheduledAt,
      notificationSent: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // BULK INSERT OCCURRENCES
    if (occurrences.length > 0) {
      await medicationReminderOccurrenceRepository.bulkCreate(occurrences);
    }

    return createdMedication;
  }

  // UPDATE MEDICATION
  async updateMedication(id, userId, payload) {
    const validData = await validateSchema(updateMedicationSchema, payload);

    const existingMedication = await medicationRepository.findById(id);

    if (!existingMedication || String(existingMedication.userId) !== String(userId)) {
      throw new NotFoundException(errorConstants.MEDICATION_NOT_FOUND);
    }

    const updatedPayload = {
      ...existingMedication,
      ...validData,
    };

    const { endDate, remainingQuantity, dailyConsumption, unit } =
      calculateMedicationValues(updatedPayload);

    const safeEndDate = endDate ? new Date(endDate) : null;

    return medicationRepository.updateById(id, {
      ...validData,

      endDate: safeEndDate,

      remainingQuantity,
      dailyConsumption,

      unit,
    });
  }

  // GET BY ID
  async getMedicationById(id, userId) {
    const existingMedication = await medicationRepository.findById(id);

    if (!existingMedication || String(existingMedication.userId) !== String(userId)) {
      throw new NotFoundException(errorConstants.MEDICATION_NOT_FOUND);
    }

    return existingMedication;
  }

  // GET ALL
  async getMedicationList() {
    return medicationRepository.findAll();
  }

  // FILTER LIST
  async listMedications(payload) {
    const filters = await validateSchema(listMedicationQuerySchema, payload || {});

    return medicationRepository.findAllWithFilters(filters);
  }

  // PAGINATED LIST
  async listMedicationsPaginated(payload, userId) {
    if (!userId) {
      throw new NotFoundException(errorConstants.USER_NOT_FOUND);
    }

    const filters = await validateSchema(listMedicationQuerySchema, payload);

    return medicationRepository.findAllWithPagination({
      ...filters,
      userId,
    });
  }

  // DELETE
  async deleteMedication(id, userId) {
    const existingMedication = await medicationRepository.findById(id);

    if (!existingMedication || String(existingMedication.userId) !== String(userId)) {
      throw new NotFoundException(errorConstants.MEDICATION_NOT_FOUND);
    }

    return medicationRepository.softDeleteById(id);
  }
}

module.exports = new MedicationService();

function generateReminderTimes(medication) {
  const reminders = [];
  const { medicationTime, startDate, endDate, userId, id, foodFrequency } = medication;
  const currentDate = new Date(startDate);
  const finalDate = new Date(endDate);

  while (currentDate <= finalDate) {
    medicationTime.forEach((timeObj) => {
      const reminderDate = new Date(currentDate);
      const [hours, minutes] = timeObj.time.split(":");
      reminderDate.setHours(Number(hours));
      reminderDate.setMinutes(Number(minutes));
      reminders.push({
        patientId: userId,
        medicationId: id,
        foodType: foodFrequency,
        scheduledAt: reminderDate,
        status: "PENDING",
      });
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return reminders;
}

module.exports = {
  generateReminderTimes,
};

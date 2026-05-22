function isValidDate(d) {
  return d instanceof Date && !isNaN(d.getTime());
}

function convertTo24Hour(time, period) {
  if (!time || typeof time !== "string") {
    throw new Error("Invalid time format");
  }

  const parts = time.split(":");
  if (parts.length !== 2) {
    throw new Error("Time must be HH:MM format");
  }

  let hours = Number(parts[0]);
  let minutes = Number(parts[1]);

  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error("Invalid numeric time value");
  }

  if (!period) {
    throw new Error("Missing AM/PM period");
  }

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
}

function generateReminderTimes(medication) {
  const reminders = [];

  const { medicationTime, startDate, endDate, id } = medication;

  if (!Array.isArray(medicationTime)) {
    throw new Error("medicationTime must be an array");
  }

  const start = new Date(startDate);

  if (!isValidDate(start)) {
    throw new Error("Invalid startDate");
  }

  let end = endDate ? new Date(endDate) : new Date(startDate);

  if (!isValidDate(end)) {
    throw new Error("Invalid endDate");
  }

  const currentDate = new Date(start.getTime());

  while (currentDate <= end) {
    medicationTime.forEach((timeObj) => {
      const { hours, minutes } = convertTo24Hour(timeObj.time, timeObj.period);

      const reminderDate = new Date(currentDate.getTime());
      reminderDate.setHours(hours, minutes, 0, 0);

      if (!isValidDate(reminderDate)) {
        console.log("Skipping invalid reminderDate:", reminderDate);
        return;
      }

      reminders.push({
        reminderId: id,
        type: "AFTER_MEDICATION",
        status: "PENDING",
        scheduledAt: reminderDate,
        notificationSent: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return reminders;
}

module.exports = {
  generateReminderTimes,
};

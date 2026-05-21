const cron = require("node-cron");

const repository = require("../repositories/medicationReminderOccurrenceRepository");

cron.schedule("* * * * *", async () => {
  const reminders = await repository.findMissedReminders();

  for (const reminder of reminders) {
    await repository.updateById(reminder.id, {
      status: "MISSED",
    });
  }
});

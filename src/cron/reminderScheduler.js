const cron = require("node-cron");

const repository = require("../repositories/medicationReminderOccurrenceRepository");

cron.schedule("* * * * *", async () => {
  const reminders = await repository.findDueReminders();

  for (const reminder of reminders) {
    console.log("SEND PUSH NOTIFICATION:", reminder.id);

    await repository.updateById(reminder.id, {
      status: "SENT",
      notificationSent: true,
      sentAt: new Date(),
    });
  }
});

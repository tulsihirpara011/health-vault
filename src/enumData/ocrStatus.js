const StatusType = Object.freeze({
  PENDING: "Pending",
  IN_PROGRESS: "In_progress",
  COMPLETED: "Completed",
  FAILED: "Failed",
});
const StatusTypeValues = Object.values(StatusType);
module.exports = {
  StatusType,
  StatusTypeValues,
};

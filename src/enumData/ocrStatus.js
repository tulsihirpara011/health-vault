const StatusType = Object.freeze({
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  FAILED: "failed",
});
const StatusTypeValues = Object.values(StatusType);
module.exports = {
  StatusType,
  StatusTypeValues,
};

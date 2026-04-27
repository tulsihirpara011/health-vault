const StatusType = Object.freeze({
  PENDING: "Pending",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  FAILED: "Failed",
});

const StatusTypeValues = Object.values(StatusType);
module.exports = { StatusType, StatusTypeValues };

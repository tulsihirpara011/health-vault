const StatusType = Object.freeze({
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
});

const StatusTypeValues = Object.values(StatusType);
module.exports = { StatusType, StatusTypeValues };

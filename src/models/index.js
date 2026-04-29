// index.js

const { Patient } = require("./patient");
const { session } = require("./session");
const { healthRecords } = require("./Health_Recode");
const { Document } = require("./Document");

// Export all tables in one place
module.exports = {
  Patient,
  session,
  healthRecords,
  Document,
};

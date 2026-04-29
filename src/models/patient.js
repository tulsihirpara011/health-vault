const {
  serial,
  pgTable,
  integer,
  varchar,
  timestamp,
  boolean,
  date,
  pgEnum,
} = require("drizzle-orm/pg-core");
const { genderTypeValue } = require("../enumData/genderEnum");
const genderEnumDb = pgEnum("gender_types", genderTypeValue);

const Patient = pgTable("patient", {
  id: serial("id").primaryKey(),
  patientCode: varchar("patient_code", { length: 50 }).notNull().unique(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  gender: genderEnumDb("gender").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  age: integer("age").notNull(),
  phone: varchar("phone", { length: 10 }).notNull(),

  //forget passwored fields
  resetToken: varchar("reset_token", { length: 255 }),
  resetTokenExpiry: timestamp("reset_token_expiry"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  softDelete: boolean("soft_delete").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
module.exports = { Patient };

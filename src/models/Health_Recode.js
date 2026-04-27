const {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} = require("drizzle-orm/pg-core");
const { Patient } = require("./patient");

const healthRecords = pgTable("health_records", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => Patient.id, { onDelete: "cascade" }),

  record: text("record"),

  softDelete: boolean("soft_delete").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

module.exports = { healthRecords };

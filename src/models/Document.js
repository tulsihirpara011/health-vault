const {
  integer,
  pgTable,
  varchar,
  serial,
  timestamp,
  boolean,
  text,
  date,
  pgEnum
} = require("drizzle-orm/pg-core");
const { Patient } = require("./patient");
const { fileEnum, FileTypesValues } = require("../enumData/fileEnum");
const { StatusType, StatusTypeValues} = require("../enumData/ocrStatus");
const { documentEnum,documentTypeEnum } = require("../enumData/documentType");
const fileTypeEnumDb = pgEnum("file_type", FileTypesValues);
const documentTypeEnumDb = pgEnum("document_type", documentTypeEnum);
const ocrStatusEnumDb = pgEnum("ocr_status", StatusTypeValues);
const Document = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => Patient.id, { onDelete: "cascade" }),
  // documentType: documentTypeEnumDb("document_type").default(documentEnum.OTHER).notNull(),
  fileName: varchar("file_name", { length: 255 }),
  fileStoragePath: text("file_path"),
  fileType: fileTypeEnumDb("file_type"),
  fileSize: integer("file_size"),
  OCRStatus: ocrStatusEnumDb("ocr_status")
    .default(StatusType.PENDING)
    .notNull(),
  ocrextractedText: text("OCR_extracted_text"),
  structuredExtractedData: varchar("structured_extracted_data"),
  reportDate: date("report_date"),
  hospitalName: varchar("hospital_name"),
  doctorName: varchar("doctor_name", { length: 25 }),
  remarks: text("reamrk"),
  softDelete: boolean("soft_delete").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

module.exports = { Document };

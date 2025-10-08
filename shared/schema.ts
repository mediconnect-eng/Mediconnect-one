import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User role enum
export type UserRole = "patient" | "gp" | "specialist" | "pharmacy" | "diagnostics";

// Consult status enum
export type ConsultStatus = "intake" | "queued" | "in_progress" | "completed";

// Prescription status enum  
export type PrescriptionStatus = "active" | "dispensed" | "expired";

// Diagnostics order status enum
export type DiagnosticsStatus = "ordered" | "sample_collected" | "in_progress" | "completed";

// Referral status enum
export type ReferralStatus = "proposed" | "accepted" | "completed";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").unique(),
  email: text("email"),
  role: text("role").notNull().$type<UserRole>(),
  metadata: jsonb("metadata"),
});

// Consults table
export const consults = pgTable("consults", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => users.id),
  gpId: varchar("gp_id").references(() => users.id),
  status: text("status").notNull().$type<ConsultStatus>(),
  intakeSummary: text("intake_summary"),
  intakeData: jsonb("intake_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages table
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  consultId: varchar("consult_id").notNull().references(() => consults.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Prescriptions table
export const prescriptions = pgTable("prescriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => users.id),
  consultId: varchar("consult_id").references(() => consults.id),
  status: text("status").notNull().$type<PrescriptionStatus>(),
  items: jsonb("items").notNull(),
  qrToken: text("qr_token"),
  qrDisabled: integer("qr_disabled").default(0),
  pdfDownloaded: integer("pdf_downloaded").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Referrals table
export const referrals = pgTable("referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => users.id),
  gpId: varchar("gp_id").notNull().references(() => users.id),
  specialistId: varchar("specialist_id").references(() => users.id),
  status: text("status").notNull().$type<ReferralStatus>(),
  reason: text("reason").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Diagnostics orders table
export const diagnosticsOrders = pgTable("diagnostics_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => users.id),
  specialistId: varchar("specialist_id").notNull().references(() => users.id),
  labId: varchar("lab_id").references(() => users.id),
  status: text("status").notNull().$type<DiagnosticsStatus>(),
  testType: text("test_type").notNull(),
  resultUrl: text("result_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertConsultSchema = createInsertSchema(consults).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertPrescriptionSchema = createInsertSchema(prescriptions).omit({ id: true, createdAt: true });
export const insertReferralSchema = createInsertSchema(referrals).omit({ id: true, createdAt: true });
export const insertDiagnosticsOrderSchema = createInsertSchema(diagnosticsOrders).omit({ id: true, createdAt: true, updatedAt: true });

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Consult = typeof consults.$inferSelect;
export type InsertConsult = z.infer<typeof insertConsultSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Prescription = typeof prescriptions.$inferSelect;
export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;

export type DiagnosticsOrder = typeof diagnosticsOrders.$inferSelect;
export type InsertDiagnosticsOrder = z.infer<typeof insertDiagnosticsOrderSchema>;

// Prescription item type
export type PrescriptionItem = {
  id: string;
  name: string;
  dosage: string;
  quantity: string;
  frequency: string;
  duration: string;
  instructions?: string;
};

// Pharmacy view (item-only, no PII)
export type PharmacyView = {
  items: PrescriptionItem[];
  prescriptionId: string;
  meta: {
    noPII: true;
  };
};

// Intake form data
export type IntakeFormData = {
  symptoms: string;
  duration: string;
  severity: string;
  medications?: string;
  allergies?: string;
};

// Drizzle relations
export const usersRelations = relations(users, ({ many }) => ({
  consultAsPatient: many(consults, { relationName: "patientConsults" }),
  consultAsGp: many(consults, { relationName: "gpConsults" }),
  prescriptions: many(prescriptions),
  referralsAsPatient: many(referrals, { relationName: "patientReferrals" }),
  referralsAsGp: many(referrals, { relationName: "gpReferrals" }),
  diagnosticsOrders: many(diagnosticsOrders),
}));

export const consultsRelations = relations(consults, ({ one, many }) => ({
  patient: one(users, {
    fields: [consults.patientId],
    references: [users.id],
    relationName: "patientConsults",
  }),
  gp: one(users, {
    fields: [consults.gpId],
    references: [users.id],
    relationName: "gpConsults",
  }),
  messages: many(messages),
  prescriptions: many(prescriptions),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  consult: one(consults, {
    fields: [messages.consultId],
    references: [consults.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const prescriptionsRelations = relations(prescriptions, ({ one }) => ({
  patient: one(users, {
    fields: [prescriptions.patientId],
    references: [users.id],
  }),
  consult: one(consults, {
    fields: [prescriptions.consultId],
    references: [consults.id],
  }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  patient: one(users, {
    fields: [referrals.patientId],
    references: [users.id],
    relationName: "patientReferrals",
  }),
  gp: one(users, {
    fields: [referrals.gpId],
    references: [users.id],
    relationName: "gpReferrals",
  }),
  specialist: one(users, {
    fields: [referrals.specialistId],
    references: [users.id],
  }),
}));

export const diagnosticsOrdersRelations = relations(diagnosticsOrders, ({ one }) => ({
  patient: one(users, {
    fields: [diagnosticsOrders.patientId],
    references: [users.id],
  }),
  specialist: one(users, {
    fields: [diagnosticsOrders.specialistId],
    references: [users.id],
  }),
  lab: one(users, {
    fields: [diagnosticsOrders.labId],
    references: [users.id],
  }),
}));

import type {
  User, InsertUser,
  Consult, InsertConsult,
  Message, InsertMessage,
  Prescription, InsertPrescription,
  Referral, InsertReferral,
  DiagnosticsOrder, InsertDiagnosticsOrder,
  UserRole
} from "@shared/schema";
import { users, consults, messages, prescriptions, referrals, diagnosticsOrders } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, isNull } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  
  // Consults
  getConsult(id: string): Promise<Consult | undefined>;
  listConsults(role: UserRole, userId: string): Promise<Consult[]>;
  createConsult(consult: InsertConsult): Promise<Consult>;
  updateConsult(id: string, updates: Partial<Consult>): Promise<Consult>;
  
  // Messages
  listMessages(consultId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Prescriptions
  getPrescription(id: string): Promise<Prescription | undefined>;
  listPrescriptions(patientId: string): Promise<Prescription[]>;
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  updatePrescription(id: string, updates: Partial<Prescription>): Promise<Prescription>;
  getPrescriptionByQrToken(token: string): Promise<Prescription | undefined>;
  
  // Referrals
  getReferral(id: string): Promise<Referral | undefined>;
  listReferrals(userId: string, role: UserRole): Promise<Referral[]>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  
  // Diagnostics
  getDiagnosticsOrder(id: string): Promise<DiagnosticsOrder | undefined>;
  listDiagnosticsOrders(userId: string, role: UserRole): Promise<DiagnosticsOrder[]>;
  createDiagnosticsOrder(order: InsertDiagnosticsOrder): Promise<DiagnosticsOrder>;
  updateDiagnosticsOrder(id: string, updates: Partial<DiagnosticsOrder>): Promise<DiagnosticsOrder>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values([insertUser]).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [updated] = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    
    if (!updated) throw new Error("User not found");
    return updated;
  }

  // Consults
  async getConsult(id: string): Promise<Consult | undefined> {
    const [consult] = await db.select().from(consults).where(eq(consults.id, id));
    return consult;
  }

  async listConsults(role: UserRole, userId: string): Promise<Consult[]> {
    if (role === "patient") {
      return db.select().from(consults).where(eq(consults.patientId, userId));
    } else if (role === "gp") {
      return db.select().from(consults).where(
        or(eq(consults.gpId, userId), isNull(consults.gpId))
      );
    } else if (role === "specialist" || role === "pharmacy" || role === "diagnostics") {
      return [];
    }
    return db.select().from(consults);
  }

  async createConsult(insertConsult: InsertConsult): Promise<Consult> {
    const [consult] = await db.insert(consults).values([insertConsult]).returning();
    return consult;
  }

  async updateConsult(id: string, updates: Partial<Consult>): Promise<Consult> {
    const [updated] = await db.update(consults)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(consults.id, id))
      .returning();
    
    if (!updated) throw new Error("Consult not found");
    return updated;
  }

  // Messages
  async listMessages(consultId: string): Promise<Message[]> {
    return db.select().from(messages)
      .where(eq(messages.consultId, consultId))
      .orderBy(messages.createdAt);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  // Prescriptions
  async getPrescription(id: string): Promise<Prescription | undefined> {
    const [prescription] = await db.select().from(prescriptions).where(eq(prescriptions.id, id));
    return prescription;
  }

  async listPrescriptions(patientId: string): Promise<Prescription[]> {
    return db.select().from(prescriptions).where(eq(prescriptions.patientId, patientId));
  }

  async createPrescription(insertPrescription: InsertPrescription): Promise<Prescription> {
    const [prescription] = await db.insert(prescriptions).values([insertPrescription]).returning();
    return prescription;
  }

  async updatePrescription(id: string, updates: Partial<Prescription>): Promise<Prescription> {
    const [updated] = await db.update(prescriptions)
      .set(updates)
      .where(eq(prescriptions.id, id))
      .returning();
    
    if (!updated) throw new Error("Prescription not found");
    return updated;
  }

  async getPrescriptionByQrToken(token: string): Promise<Prescription | undefined> {
    const [prescription] = await db.select().from(prescriptions).where(eq(prescriptions.qrToken, token));
    return prescription;
  }

  // Referrals
  async getReferral(id: string): Promise<Referral | undefined> {
    const [referral] = await db.select().from(referrals).where(eq(referrals.id, id));
    return referral;
  }

  async listReferrals(userId: string, role: UserRole): Promise<Referral[]> {
    if (role === "patient") {
      return db.select().from(referrals).where(eq(referrals.patientId, userId));
    } else if (role === "gp") {
      return db.select().from(referrals).where(eq(referrals.gpId, userId));
    } else if (role === "specialist") {
      return db.select().from(referrals).where(eq(referrals.specialistId, userId));
    }
    return db.select().from(referrals);
  }

  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const [referral] = await db.insert(referrals).values([insertReferral]).returning();
    return referral;
  }

  // Diagnostics
  async getDiagnosticsOrder(id: string): Promise<DiagnosticsOrder | undefined> {
    const [order] = await db.select().from(diagnosticsOrders).where(eq(diagnosticsOrders.id, id));
    return order;
  }

  async listDiagnosticsOrders(userId: string, role: UserRole): Promise<DiagnosticsOrder[]> {
    if (role === "patient") {
      return db.select().from(diagnosticsOrders).where(eq(diagnosticsOrders.patientId, userId));
    } else if (role === "specialist") {
      return db.select().from(diagnosticsOrders).where(eq(diagnosticsOrders.specialistId, userId));
    } else if (role === "diagnostics") {
      return db.select().from(diagnosticsOrders).where(eq(diagnosticsOrders.labId, userId));
    }
    return db.select().from(diagnosticsOrders);
  }

  async createDiagnosticsOrder(insertOrder: InsertDiagnosticsOrder): Promise<DiagnosticsOrder> {
    const [order] = await db.insert(diagnosticsOrders).values([insertOrder]).returning();
    return order;
  }

  async updateDiagnosticsOrder(id: string, updates: Partial<DiagnosticsOrder>): Promise<DiagnosticsOrder> {
    const [updated] = await db.update(diagnosticsOrders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(diagnosticsOrders.id, id))
      .returning();
    
    if (!updated) throw new Error("Diagnostics order not found");
    return updated;
  }
}

export const storage = new DatabaseStorage();

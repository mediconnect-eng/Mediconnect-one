import type {
  User, InsertUser,
  Consult, InsertConsult,
  Message, InsertMessage,
  Prescription, InsertPrescription,
  Referral, InsertReferral,
  DiagnosticsOrder, InsertDiagnosticsOrder,
  UserRole, PrescriptionItem
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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

export class MemStorage implements IStorage {
  private users = new Map<string, User>();
  private consults = new Map<string, Consult>();
  private messages = new Map<string, Message>();
  private prescriptions = new Map<string, Prescription>();
  private referrals = new Map<string, Referral>();
  private diagnosticsOrders = new Map<string, DiagnosticsOrder>();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed users
    const patientId = randomUUID();
    const gpId = randomUUID();
    const specialistId = randomUUID();
    const pharmacyId = randomUUID();
    const labId = randomUUID();

    this.users.set(patientId, {
      id: patientId,
      name: "John Doe",
      phone: "+1234567890",
      email: "patient@demo.com",
      role: "patient",
      metadata: {}
    });

    this.users.set(gpId, {
      id: gpId,
      name: "Dr. Sarah Johnson",
      phone: "+1234567891",
      email: "gp@demo.com",
      role: "gp",
      metadata: {}
    });

    this.users.set(specialistId, {
      id: specialistId,
      name: "Dr. David Williams",
      phone: "+1234567892",
      email: "specialist@demo.com",
      role: "specialist",
      metadata: { specialty: "Cardiology" }
    });

    this.users.set(pharmacyId, {
      id: pharmacyId,
      name: "HealthCare Pharmacy",
      phone: "+1234567893",
      email: "pharmacy@demo.com",
      role: "pharmacy",
      metadata: {}
    });

    this.users.set(labId, {
      id: labId,
      name: "HealthLab Diagnostics",
      phone: "+1234567894",
      email: "lab@demo.com",
      role: "diagnostics",
      metadata: {}
    });

    // Seed consult
    const consultId = randomUUID();
    this.consults.set(consultId, {
      id: consultId,
      patientId,
      gpId,
      status: "completed",
      intakeSummary: "Patient reports fever and headache for 3 days. Moderate severity.",
      intakeData: {
        symptoms: "Fever and headache",
        duration: "3 days",
        severity: "moderate",
        medications: "None",
        allergies: "None"
      },
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date()
    });

    // Seed prescription
    const prescriptionId = randomUUID();
    const items: PrescriptionItem[] = [
      {
        id: "1",
        name: "Amoxicillin",
        dosage: "500mg",
        frequency: "3 times daily",
        duration: "7 days",
        instructions: "Take with food"
      },
      {
        id: "2",
        name: "Ibuprofen",
        dosage: "200mg",
        frequency: "As needed for pain",
        duration: "14 days",
        instructions: "Do not exceed 6 tablets in 24 hours"
      }
    ];

    this.prescriptions.set(prescriptionId, {
      id: prescriptionId,
      patientId,
      consultId,
      status: "active",
      items,
      qrToken: "QR-ABC123XYZ789",
      qrDisabled: 0,
      pdfDownloaded: 0,
      createdAt: new Date()
    });

    // Seed diagnostics orders
    const order1Id = randomUUID();
    this.diagnosticsOrders.set(order1Id, {
      id: order1Id,
      patientId,
      specialistId,
      labId,
      status: "completed",
      testType: "Complete Blood Count (CBC)",
      resultUrl: "local://results-cbc-001",
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date()
    });

    const order2Id = randomUUID();
    this.diagnosticsOrders.set(order2Id, {
      id: order2Id,
      patientId,
      specialistId,
      labId: null,
      status: "in_progress",
      testType: "Lipid Panel",
      resultUrl: null,
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date()
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.phone === phone);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Consults
  async getConsult(id: string): Promise<Consult | undefined> {
    return this.consults.get(id);
  }

  async listConsults(role: UserRole, userId: string): Promise<Consult[]> {
    const allConsults = Array.from(this.consults.values());
    
    if (role === "patient") {
      return allConsults.filter(c => c.patientId === userId);
    } else if (role === "gp") {
      return allConsults.filter(c => c.gpId === userId || !c.gpId);
    }
    
    return allConsults;
  }

  async createConsult(insertConsult: InsertConsult): Promise<Consult> {
    const id = randomUUID();
    const consult: Consult = {
      ...insertConsult,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.consults.set(id, consult);
    return consult;
  }

  async updateConsult(id: string, updates: Partial<Consult>): Promise<Consult> {
    const consult = this.consults.get(id);
    if (!consult) throw new Error("Consult not found");
    
    const updated = { ...consult, ...updates, updatedAt: new Date() };
    this.consults.set(id, updated);
    return updated;
  }

  // Messages
  async listMessages(consultId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => m.consultId === consultId)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      createdAt: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  // Prescriptions
  async getPrescription(id: string): Promise<Prescription | undefined> {
    return this.prescriptions.get(id);
  }

  async listPrescriptions(patientId: string): Promise<Prescription[]> {
    return Array.from(this.prescriptions.values())
      .filter(p => p.patientId === patientId);
  }

  async createPrescription(insertPrescription: InsertPrescription): Promise<Prescription> {
    const id = randomUUID();
    const prescription: Prescription = {
      ...insertPrescription,
      id,
      createdAt: new Date()
    };
    this.prescriptions.set(id, prescription);
    return prescription;
  }

  async updatePrescription(id: string, updates: Partial<Prescription>): Promise<Prescription> {
    const prescription = this.prescriptions.get(id);
    if (!prescription) throw new Error("Prescription not found");
    
    const updated = { ...prescription, ...updates };
    this.prescriptions.set(id, updated);
    return updated;
  }

  async getPrescriptionByQrToken(token: string): Promise<Prescription | undefined> {
    return Array.from(this.prescriptions.values())
      .find(p => p.qrToken === token);
  }

  // Referrals
  async getReferral(id: string): Promise<Referral | undefined> {
    return this.referrals.get(id);
  }

  async listReferrals(userId: string, role: UserRole): Promise<Referral[]> {
    const allReferrals = Array.from(this.referrals.values());
    
    if (role === "patient") {
      return allReferrals.filter(r => r.patientId === userId);
    } else if (role === "gp") {
      return allReferrals.filter(r => r.gpId === userId);
    } else if (role === "specialist") {
      return allReferrals.filter(r => r.specialistId === userId);
    }
    
    return allReferrals;
  }

  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const id = randomUUID();
    const referral: Referral = {
      ...insertReferral,
      id,
      createdAt: new Date()
    };
    this.referrals.set(id, referral);
    return referral;
  }

  // Diagnostics
  async getDiagnosticsOrder(id: string): Promise<DiagnosticsOrder | undefined> {
    return this.diagnosticsOrders.get(id);
  }

  async listDiagnosticsOrders(userId: string, role: UserRole): Promise<DiagnosticsOrder[]> {
    const allOrders = Array.from(this.diagnosticsOrders.values());
    
    if (role === "patient") {
      return allOrders.filter(o => o.patientId === userId);
    } else if (role === "specialist") {
      return allOrders.filter(o => o.specialistId === userId);
    } else if (role === "diagnostics") {
      return allOrders.filter(o => o.labId === userId);
    }
    
    return allOrders;
  }

  async createDiagnosticsOrder(insertOrder: InsertDiagnosticsOrder): Promise<DiagnosticsOrder> {
    const id = randomUUID();
    const order: DiagnosticsOrder = {
      ...insertOrder,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.diagnosticsOrders.set(id, order);
    return order;
  }

  async updateDiagnosticsOrder(id: string, updates: Partial<DiagnosticsOrder>): Promise<DiagnosticsOrder> {
    const order = this.diagnosticsOrders.get(id);
    if (!order) throw new Error("Diagnostics order not found");
    
    const updated = { ...order, ...updates, updatedAt: new Date() };
    this.diagnosticsOrders.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();

import type { 
  User, 
  Consult, 
  Prescription, 
  Referral, 
  DiagnosticsOrder,
  Message,
  PharmacyView,
  IntakeFormData,
  UserRole
} from "./schema";

// Auth Port - handles authentication and OTP
export interface AuthPort {
  requestOtp(phone: string): Promise<{ success: boolean; message: string }>;
  verifyOtp(phone: string, code: string): Promise<{ success: boolean; user?: User }>;
  mockLogin(email: string, phone: string, role: UserRole): Promise<User>;
}

// Consult Port - handles consultations
export interface ConsultPort {
  startIntake(patientId: string, data: IntakeFormData): Promise<Consult>;
  queueConsult(patientId: string): Promise<Consult>;
  listConsults(role: UserRole, userId: string): Promise<Consult[]>;
  getConsult(id: string): Promise<Consult | undefined>;
  updateConsultStatus(id: string, status: string): Promise<Consult>;
}

// Referral Port - handles specialist referrals
export interface ReferralPort {
  proposeSpecialists(gpId: string, patientId: string, reason: string): Promise<User[]>;
  createReferral(gpId: string, patientId: string, specialistId: string, reason: string, notes?: string): Promise<Referral>;
  listReferrals(userId: string, role: UserRole): Promise<Referral[]>;
}

// Prescription Port - handles prescriptions and QR codes
export interface PrescriptionPort {
  listPrescriptions(patientId: string): Promise<Prescription[]>;
  getPrescription(id: string): Promise<Prescription | undefined>;
  renderQr(id: string): Promise<string>;
  markPdfDownloaded(id: string): Promise<Prescription>;
  createPrescription(data: any): Promise<Prescription>;
}

// Pharmacy Port - handles pharmacy QR verification
export interface PharmacyPort {
  resolveQrToken(token: string): Promise<PharmacyView>;
}

// Diagnostics Port - handles lab orders
export interface DiagnosticsPort {
  listOrders(userId: string, role: UserRole): Promise<DiagnosticsOrder[]>;
  uploadResult(orderId: string, fileData: any): Promise<DiagnosticsOrder>;
  getOrder(id: string): Promise<DiagnosticsOrder | undefined>;
}

// Notification Port - handles notifications (stub)
export interface NotificationPort {
  notify(topic: string, payload: any): Promise<void>;
}

// Storage Port - handles file storage (stub)
export interface StoragePort {
  put(file: any): Promise<string>;
  get(url: string): Promise<any>;
}

// Audit Port - handles audit logging
export interface AuditPort {
  log(event: string, actor: string, resource: string, meta?: any): Promise<void>;
}

// Message Port - handles chat messages
export interface MessagePort {
  listMessages(consultId: string): Promise<Message[]>;
  sendMessage(consultId: string, senderId: string, content: string): Promise<Message>;
}

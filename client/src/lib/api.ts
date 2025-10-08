import { apiRequest } from "./queryClient";
import type { 
  User, 
  Consult, 
  Prescription, 
  DiagnosticsOrder,
  Referral,
  Message,
  PharmacyView,
  IntakeFormData,
  UserRole
} from "@shared/schema";

export type EnrichedDiagnosticsOrder = {
  id: string;
  orderId: string;
  testType: string;
  status: "ordered" | "sample_collected" | "in_progress" | "completed";
  createdAt: Date | string;
  labId: string | null;
  labInfo: {
    name: string;
    location: string;
  } | null;
  resultUrl: string | null;
};

export const api = {
  auth: {
    async signup(data: { name: string; email: string; phone: string; dateOfBirth?: string; gender?: string }): Promise<{ user: User }> {
      return apiRequest("POST", "/api/auth/signup", data);
    },
    async mockLogin(email: string, phone: string, role: UserRole): Promise<{ user: User }> {
      return apiRequest("POST", "/api/auth/mock-login", { email, phone, role });
    },
    async requestOtp(phone: string) {
      return apiRequest("POST", "/api/auth/request-otp", { phone });
    },
    async verifyOtp(phone: string, code: string) {
      return apiRequest("POST", "/api/auth/verify-otp", { phone, code });
    }
  },

  consults: {
    async startIntake(patientId: string, data: IntakeFormData): Promise<Consult> {
      return apiRequest("POST", "/api/consults/intake", { patientId, data });
    },
    async queueConsult(id: string): Promise<Consult> {
      return apiRequest("POST", `/api/consults/${id}/queue`, {});
    },
    async listConsults(role: UserRole, userId: string): Promise<Consult[]> {
      return apiRequest("GET", `/api/consults?role=${role}&userId=${userId}`, undefined);
    },
    async getConsult(id: string): Promise<Consult> {
      return apiRequest("GET", `/api/consults/${id}`, undefined);
    }
  },

  prescriptions: {
    async list(patientId: string): Promise<Prescription[]> {
      return apiRequest("GET", `/api/prescriptions?patientId=${patientId}`, undefined);
    },
    async get(id: string): Promise<Prescription> {
      return apiRequest("GET", `/api/prescriptions/${id}`, undefined);
    },
    async getQrImage(id: string, userId: string): Promise<{ qrDataUri: string }> {
      return apiRequest("GET", `/api/prescriptions/${id}/qr-image?userId=${userId}`, undefined);
    },
    async downloadPdf(id: string): Promise<Prescription> {
      return apiRequest("POST", `/api/prescriptions/${id}/download-pdf`, {});
    }
  },

  pharmacy: {
    async verifyQr(qrToken: string): Promise<PharmacyView> {
      return apiRequest("POST", "/api/pharmacy/verify", { qrToken });
    }
  },

  diagnostics: {
    async listOrders(userId: string, role: UserRole): Promise<EnrichedDiagnosticsOrder[]> {
      return apiRequest("GET", `/api/diagnostics/orders?userId=${userId}&role=${role}`, undefined);
    },
    async uploadResult(orderId: string, fileData: any): Promise<DiagnosticsOrder> {
      return apiRequest("POST", `/api/diagnostics/orders/${orderId}/upload`, { fileData });
    }
  },

  referrals: {
    async list(userId: string, role: UserRole): Promise<Referral[]> {
      return apiRequest("GET", `/api/referrals?userId=${userId}&role=${role}`, undefined);
    },
    async create(data: { gpId: string; patientId: string; specialistId: string; reason: string; notes?: string }): Promise<Referral> {
      return apiRequest("POST", "/api/referrals", data);
    }
  },

  messages: {
    async list(consultId: string): Promise<Message[]> {
      return apiRequest("GET", `/api/consults/${consultId}/messages`, undefined);
    },
    async send(consultId: string, senderId: string, content: string): Promise<Message> {
      return apiRequest("POST", `/api/consults/${consultId}/messages`, { senderId, content });
    }
  }
};

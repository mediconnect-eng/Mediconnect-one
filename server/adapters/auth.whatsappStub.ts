import type { AuthPort } from "@shared/ports";
import type { User, UserRole } from "@shared/schema";
import { randomUUID } from "crypto";

export class WhatsAppAuthStub implements AuthPort {
  async requestOtp(phone: string): Promise<{ success: boolean; message: string }> {
    console.log(`[WhatsAppStub] OTP requested for ${phone}`);
    return {
      success: true,
      message: `OTP sent to ${phone} (stub mode, any code works)`
    };
  }

  async verifyOtp(phone: string, code: string): Promise<{ success: boolean; user?: User }> {
    console.log(`[WhatsAppStub] Verifying OTP ${code} for ${phone}`);
    
    return {
      success: true,
      user: {
        id: randomUUID(),
        name: "Demo User",
        phone,
        email: null,
        role: "patient" as UserRole,
        metadata: {}
      }
    };
  }

  async mockLogin(identifier: string, role: UserRole): Promise<User> {
    console.log(`[WhatsAppStub] Mock login: ${identifier} as ${role}`);
    
    const roleNames: Record<UserRole, string> = {
      patient: "Demo Patient",
      gp: "Dr. Sarah Johnson",
      specialist: "Dr. David Williams",
      pharmacy: "HealthCare Pharmacy",
      diagnostics: "HealthLab Diagnostics"
    };

    return {
      id: randomUUID(),
      name: roleNames[role],
      phone: identifier.includes('@') ? '' : identifier,
      email: identifier.includes('@') ? identifier : null,
      role,
      metadata: {}
    };
  }
}

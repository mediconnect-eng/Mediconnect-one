import type { AuthPort } from "@shared/ports";
import type { User, UserRole } from "@shared/schema";
import type { IStorage } from "../storage";
import { randomUUID } from "crypto";

export class WhatsAppAuthStub implements AuthPort {
  constructor(private storage: IStorage) {}

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

  async mockLogin(email: string, phone: string, role: UserRole): Promise<User> {
    console.log(`[WhatsAppStub] Mock login: ${email} (${phone}) as ${role}`);
    
    // Try to find existing user by email (primary identifier)
    const existingUserByEmail = await this.storage.getUserByEmail(email);
    if (existingUserByEmail) {
      console.log(`[WhatsAppStub] Found existing user by email: ${existingUserByEmail.id}`);
      
      // Update phone if provided and different (optional for existing users)
      if (phone && existingUserByEmail.phone !== phone) {
        console.log(`[WhatsAppStub] Updating phone for user: ${existingUserByEmail.id}`);
        await this.storage.updateUser(existingUserByEmail.id, { phone });
        return { ...existingUserByEmail, phone };
      }
      
      return existingUserByEmail;
    }
    
    // For new users, both email and phone are required
    if (!email) {
      throw new Error("Email is required for new user creation");
    }
    if (!phone) {
      throw new Error("Phone number is required for new user creation");
    }
    
    const roleNames: Record<UserRole, string> = {
      patient: "Demo Patient",
      gp: "Dr. Sarah Johnson",
      specialist: "Dr. David Williams",
      pharmacy: "HealthCare Pharmacy",
      diagnostics: "HealthLab Diagnostics"
    };

    console.log(`[WhatsAppStub] Creating new user for ${email} with phone ${phone}`);
    const newUser = await this.storage.createUser({
      name: roleNames[role],
      phone,
      email,
      role,
      metadata: {}
    });

    return newUser;
  }
}

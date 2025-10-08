import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LogIn, MessageSquare } from "lucide-react";
import type { UserRole } from "@shared/schema";

interface RoleLoginProps {
  role: UserRole;
  onLogin: (email: string, phone: string) => void | Promise<void>;
}

const roleConfig: Record<UserRole, { title: string; subtitle: string }> = {
  patient: {
    title: "Patient Login",
    subtitle: "Access your health records and consultations"
  },
  gp: {
    title: "GP Portal",
    subtitle: "Manage patient consultations and referrals"
  },
  specialist: {
    title: "Specialist Portal",
    subtitle: "Review referrals and manage appointments"
  },
  pharmacy: {
    title: "Pharmacy Portal",
    subtitle: "Verify and dispense prescriptions"
  },
  diagnostics: {
    title: "Diagnostics Portal",
    subtitle: "Manage lab orders and results"
  },
};

export function RoleLogin({ role, onLogin }: RoleLoginProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const config = roleConfig[role];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && phone.trim()) {
      await onLogin(email.trim(), phone.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{config.title}</h1>
          <p className="text-muted-foreground">{config.subtitle}</p>
        </div>

        {role === "patient" && (
          <div className="bg-accent/20 border border-accent/40 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-accent-foreground">
              <MessageSquare className="h-5 w-5" />
              <p className="font-medium text-sm">WhatsApp OTP Coming Soon</p>
            </div>
            <p className="text-xs text-accent-foreground/80">
              For now, enter your email and WhatsApp number to access the demo
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid={`input-email-${role}`}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-foreground">
              WhatsApp Number
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              data-testid={`input-phone-${role}`}
              className="w-full"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            data-testid={`button-login-${role}`}
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign In
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground">
          This is a demo environment. No real authentication is performed.
        </p>
      </Card>
    </div>
  );
}

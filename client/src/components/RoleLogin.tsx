import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LogIn, MessageSquare } from "lucide-react";
import type { UserRole } from "@shared/schema";

interface RoleLoginProps {
  role: UserRole;
  onLogin: (identifier: string) => void;
}

const roleConfig: Record<UserRole, { title: string; placeholder: string; subtitle: string }> = {
  patient: {
    title: "Patient Login",
    placeholder: "Phone number",
    subtitle: "Access your health records and consultations"
  },
  gp: {
    title: "GP Portal",
    placeholder: "Email or phone",
    subtitle: "Manage patient consultations and referrals"
  },
  specialist: {
    title: "Specialist Portal",
    placeholder: "Email or phone",
    subtitle: "Review referrals and manage appointments"
  },
  pharmacy: {
    title: "Pharmacy Portal",
    placeholder: "Email or phone",
    subtitle: "Verify and dispense prescriptions"
  },
  diagnostics: {
    title: "Diagnostics Portal",
    placeholder: "Email or phone",
    subtitle: "Manage lab orders and results"
  },
};

export function RoleLogin({ role, onLogin }: RoleLoginProps) {
  const [identifier, setIdentifier] = useState("");
  const config = roleConfig[role];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.trim()) {
      onLogin(identifier.trim());
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
              For now, enter any phone number to access the demo
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="identifier" className="text-sm font-medium text-foreground">
              {config.placeholder}
            </label>
            <Input
              id="identifier"
              type="text"
              placeholder={config.placeholder}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              data-testid={`input-login-${role}`}
              className="w-full"
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

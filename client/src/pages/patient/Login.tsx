import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LogIn, MessageSquare } from "lucide-react";
import { api } from "@/lib/api";
import { useState } from "react";

export default function PatientLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && phone.trim()) {
      const { user } = await api.auth.mockLogin(email.trim(), phone.trim(), "patient");
      localStorage.setItem("mediconnect_user", JSON.stringify(user));
      setLocation("/patient/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Patient Login</h1>
          <p className="text-muted-foreground">Access your health records and consultations</p>
        </div>

        <div className="bg-accent/20 border border-accent/40 rounded-md p-4 space-y-2">
          <div className="flex items-center gap-2 text-accent-foreground">
            <MessageSquare className="h-5 w-5" />
            <p className="font-medium text-sm">WhatsApp OTP Coming Soon</p>
          </div>
          <p className="text-xs text-accent-foreground/80">
            For now, enter your email and WhatsApp number to access the prototype
          </p>
        </div>

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
              data-testid="input-email-patient"
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
              data-testid="input-phone-patient"
              className="w-full"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            data-testid="button-login-patient"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign In
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/patient/signup" className="text-primary hover:underline font-medium" data-testid="link-signup">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          This is a functional prototype. No real authentication is performed.
        </p>
      </Card>
    </div>
  );
}

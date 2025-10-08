import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Stethoscope, Building, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  const [doctorRole, setDoctorRole] = useState<string>("");
  const [partnerRole, setPartnerRole] = useState<string>("");

  const handleDoctorLogin = () => {
    if (doctorRole) {
      setLocation(doctorRole === "gp" ? "/gp/login" : "/specialist/login");
    }
  };

  const handlePartnerLogin = () => {
    if (partnerRole) {
      setLocation(partnerRole === "pharmacy" ? "/pharmacy/login" : "/diagnostics/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Mediconnect
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Healthcare Access Platform - Functional Prototype
          </p>
        </div>

        {/* Grouped Login Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Patient Login - Direct Link */}
          <Link href="/patient/login">
            <div>
              <Card 
                className="p-8 hover-elevate active-elevate-2 cursor-pointer transition-all h-full"
                data-testid="card-patient-login"
              >
                <div className="space-y-6">
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-semibold text-foreground">
                      Patient Login
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Access your prescriptions and consultations
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" data-testid="icon-patient-arrow" />
                  </div>
                </div>
              </Card>
            </div>
          </Link>

          {/* Doctor Login - Dropdown */}
          <Card 
            className="p-8 h-full"
            data-testid="card-doctor-login"
          >
            <div className="space-y-6">
              <div className="h-16 w-16 rounded-lg bg-chart-2/10 flex items-center justify-center mx-auto">
                <Stethoscope className="h-8 w-8 text-chart-2" />
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-semibold text-foreground">
                  Doctor Login
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage patient consultations and referrals
                </p>
              </div>
              <div className="space-y-3">
                <Select value={doctorRole} onValueChange={setDoctorRole}>
                  <SelectTrigger data-testid="select-doctor-role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gp" data-testid="option-gp">General Practitioner</SelectItem>
                    <SelectItem value="specialist" data-testid="option-specialist">Specialist</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="w-full" 
                  onClick={handleDoctorLogin}
                  disabled={!doctorRole}
                  data-testid="button-doctor-login"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Partner Login - Dropdown */}
          <Card 
            className="p-8 h-full"
            data-testid="card-partner-login"
          >
            <div className="space-y-6">
              <div className="h-16 w-16 rounded-lg bg-chart-4/10 flex items-center justify-center mx-auto">
                <Building className="h-8 w-8 text-chart-4" />
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-semibold text-foreground">
                  Partner Login
                </h3>
                <p className="text-sm text-muted-foreground">
                  Verify prescriptions and manage lab orders
                </p>
              </div>
              <div className="space-y-3">
                <Select value={partnerRole} onValueChange={setPartnerRole}>
                  <SelectTrigger data-testid="select-partner-role">
                    <SelectValue placeholder="Select your service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pharmacy" data-testid="option-pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="diagnostics" data-testid="option-diagnostics">Diagnostics</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="w-full" 
                  onClick={handlePartnerLogin}
                  disabled={!partnerRole}
                  data-testid="button-partner-login"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer Links */}
        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
          <Link href="/legal/terms">
            <span className="hover:text-foreground transition-colors cursor-pointer" data-testid="link-terms">
              Terms of Service
            </span>
          </Link>
          <span>•</span>
          <Link href="/legal/privacy">
            <span className="hover:text-foreground transition-colors cursor-pointer" data-testid="link-privacy">
              Privacy Policy
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

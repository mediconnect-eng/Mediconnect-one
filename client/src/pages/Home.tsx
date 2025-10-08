import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Stethoscope, 
  UserCog, 
  Pill, 
  Microscope,
  ArrowRight 
} from "lucide-react";

const roles = [
  {
    id: "patient",
    label: "Patient",
    description: "Access your health records and consultations",
    icon: User,
    href: "/patient/login",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    id: "gp",
    label: "General Practitioner",
    description: "Manage patient consultations",
    icon: Stethoscope,
    href: "/gp/login",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10"
  },
  {
    id: "specialist",
    label: "Specialist",
    description: "Review referrals and appointments",
    icon: UserCog,
    href: "/specialist/login",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10"
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    description: "Verify and dispense prescriptions",
    icon: Pill,
    href: "/pharmacy/login",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10"
  },
  {
    id: "diagnostics",
    label: "Diagnostics",
    description: "Manage lab orders and results",
    icon: Microscope,
    href: "/diagnostics/login",
    color: "text-chart-5",
    bgColor: "bg-chart-5/10"
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Mediconnect
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            WhatsApp-first healthcare platform connecting patients with medical professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Link key={role.id} href={role.href}>
                <div>
                  <Card 
                    className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all h-full"
                    data-testid={`role-card-${role.id}`}
                  >
                    <div className="space-y-4">
                      <div className={`h-12 w-12 rounded-lg ${role.bgColor} flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${role.color}`} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground flex items-center justify-between">
                          {role.label}
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </Link>
            );
          })}
        </div>

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

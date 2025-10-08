import { useLocation } from "wouter";
import { TabNav, type Tab } from "@/components/TabNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  UserCog, 
  Pill, 
  Heart, 
  Microscope, 
  User,
  Sparkles,
  LogOut
} from "lucide-react";

const tabs: Tab[] = [
  { id: "specialists", label: "Specialists", href: "/patient/home", icon: <UserCog className="h-5 w-5" /> },
  { id: "pharmacy", label: "Pharmacy", href: "/patient/home", icon: <Pill className="h-5 w-5" /> },
  { id: "care", label: "Care", href: "/patient/home", icon: <Heart className="h-5 w-5" /> },
  { id: "diagnostics", label: "Diagnostics", href: "/patient/diagnostics", icon: <Microscope className="h-5 w-5" /> },
  { id: "profile", label: "Profile", href: "/patient/profile", icon: <User className="h-5 w-5" /> },
];

export default function PatientHome() {
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("mediconnect_user");
    setLocation("/");
  };

  const handleStartIntake = () => {
    setLocation("/patient/intake");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Mediconnect</h1>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <TabNav tabs={tabs} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          <Card className="p-8 bg-gradient-to-br from-primary via-primary to-accent border-none">
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">AI Health Assistant</h2>
                <p className="text-white/90 max-w-2xl mx-auto">
                  Get instant medical guidance. Describe your symptoms and we'll connect you with the right healthcare professional.
                </p>
              </div>
              <Button
                size="lg"
                variant="secondary"
                onClick={handleStartIntake}
                data-testid="button-start-intake"
                className="bg-white text-primary hover:bg-white/90"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Health Check
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card 
              className="p-6 hover-elevate active-elevate-2 cursor-pointer"
              onClick={() => setLocation("/patient/prescriptions")}
              data-testid="card-prescriptions"
            >
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-lg bg-healthcare-prescription/10 flex items-center justify-center">
                  <Pill className="h-6 w-6 text-healthcare-prescription" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Prescriptions</h3>
                  <p className="text-sm text-muted-foreground">View and manage your medications</p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-6 hover-elevate active-elevate-2 cursor-pointer"
              onClick={() => setLocation("/patient/diagnostics")}
              data-testid="card-diagnostics"
            >
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-lg bg-healthcare-diagnostics/10 flex items-center justify-center">
                  <Microscope className="h-6 w-6 text-healthcare-diagnostics" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Diagnostics</h3>
                  <p className="text-sm text-muted-foreground">Track test results and orders</p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-6 hover-elevate active-elevate-2 cursor-pointer"
              onClick={() => setLocation("/patient/profile")}
              data-testid="card-profile"
            >
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Profile</h3>
                  <p className="text-sm text-muted-foreground">Manage your health profile</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

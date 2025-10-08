import { useState } from "react";
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
  LogOut,
  MapPin,
  Phone,
  Clock,
  CheckCircle
} from "lucide-react";

export default function PatientHome() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("care");

  const tabs: Tab[] = [
    { id: "specialists", label: "Specialists", icon: <UserCog className="h-5 w-5" />, onClick: () => setActiveTab("specialists") },
    { id: "pharmacy", label: "Pharmacy", icon: <Pill className="h-5 w-5" />, onClick: () => setActiveTab("pharmacy") },
    { id: "care", label: "Care", icon: <Heart className="h-5 w-5" />, onClick: () => setActiveTab("care") },
    { id: "diagnostics", label: "Diagnostics", href: "/patient/diagnostics", icon: <Microscope className="h-5 w-5" /> },
    { id: "profile", label: "Profile", href: "/patient/profile", icon: <User className="h-5 w-5" /> },
  ];

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

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {activeTab === "care" && (
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
        )}

        {activeTab === "specialists" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Available Specialists</h2>
              <p className="text-muted-foreground">Connect with specialized healthcare professionals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6 hover-elevate active-elevate-2 cursor-pointer" data-testid="specialist-cardiology">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Cardiology</h3>
                        <p className="text-sm text-muted-foreground">Heart & cardiovascular</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Available today</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>Virtual</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover-elevate active-elevate-2 cursor-pointer" data-testid="specialist-dermatology">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Dermatology</h3>
                        <p className="text-sm text-muted-foreground">Skin, hair & nails</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Available today</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>Virtual</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover-elevate active-elevate-2 cursor-pointer" data-testid="specialist-orthopedics">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCog className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Orthopedics</h3>
                        <p className="text-sm text-muted-foreground">Bones & joints</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Next available: Tomorrow</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>In-person</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover-elevate active-elevate-2 cursor-pointer" data-testid="specialist-neurology">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Neurology</h3>
                        <p className="text-sm text-muted-foreground">Brain & nervous system</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Available today</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>Virtual</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "pharmacy" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Pharmacy Services</h2>
              <p className="text-muted-foreground">Find nearby pharmacies and verify prescriptions</p>
            </div>

            <Card className="p-6 bg-gradient-to-br from-healthcare-prescription/10 to-healthcare-prescription/5">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-healthcare-prescription/20 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-healthcare-prescription" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Prescription Verification</h3>
                    <p className="text-sm text-muted-foreground">Verify and track your prescriptions</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setLocation("/patient/prescriptions")}
                  data-testid="button-view-prescriptions"
                >
                  View Prescriptions
                </Button>
              </div>
            </Card>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Nearby Pharmacies</h3>
              <div className="space-y-3">
                <Card className="p-4 hover-elevate active-elevate-2 cursor-pointer" data-testid="pharmacy-cvs">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-foreground">CVS Pharmacy</h4>
                      <p className="text-sm text-muted-foreground">123 Main Street</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>0.5 miles away</span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-green-600">
                        <Clock className="h-4 w-4" />
                        <span>Open now</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover-elevate active-elevate-2 cursor-pointer" data-testid="pharmacy-walgreens">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-foreground">Walgreens</h4>
                      <p className="text-sm text-muted-foreground">456 Oak Avenue</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>1.2 miles away</span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-green-600">
                        <Clock className="h-4 w-4" />
                        <span>Open now</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 hover-elevate active-elevate-2 cursor-pointer" data-testid="pharmacy-rite-aid">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-foreground">Rite Aid</h4>
                      <p className="text-sm text-muted-foreground">789 Elm Street</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>2.1 miles away</span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Closes at 6 PM</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { PatientShell } from "@/components/PatientShell";
import { FamilySwitcher, type FamilyMember } from "@/components/FamilySwitcher";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Sparkles,
  Video,
  ChevronRight,
  UserCog,
  Pill,
  Microscope,
  GraduationCap,
  MapPin,
  Play,
  MessageCircle
} from "lucide-react";

export default function PatientHome() {
  const [, setLocation] = useLocation();
  
  // For MVP: Single user, but structured for future multi-user
  const [activeMemberId, setActiveMemberId] = useState("self");
  const familyMembers: FamilyMember[] = [
    { id: "self", name: "John Smith", relation: "Self", initial: "JS" },
    // Future: { id: "spouse", name: "Sarah Smith", relation: "Spouse", initial: "SS" },
    // Future: { id: "child", name: "Emma Smith", relation: "Child", initial: "ES" },
  ];

  // Mock data for ongoing consultation (set to null to hide)
  const ongoingConsultation = {
    doctorName: "Dr. Sarah Wilson",
    type: "Video",
    eta: "5 mins"
  };

  const nearbyPharmacies = [
    { id: "1", name: "HealthPlus Pharmacy", distance: "1.2 km" },
    { id: "2", name: "Medix Drugstore", distance: "2.1 km" },
  ];

  const educationalVideos = [
    { id: "1", title: "Managing Diabetes", thumbnail: "" },
    { id: "2", title: "Heart Health Tips", thumbnail: "" },
  ];

  const quickAccessItems = [
    { id: "specialists", label: "Specialists", icon: UserCog, href: "/patient/specialists" },
    { id: "pharmacy", label: "Pharmacy", icon: Pill, href: "/patient/pharmacy" },
    { id: "diagnostics", label: "Diagnostics", icon: Microscope, href: "/patient/diagnostics" },
    { id: "education", label: "Education", icon: GraduationCap, href: "/patient" },
  ];

  return (
    <PatientShell notificationCount={3}>
      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        {/* Family Switcher */}
        <FamilySwitcher
          members={familyMembers}
          activeMemberId={activeMemberId}
          onSwitch={setActiveMemberId}
        />

        {/* How can we help today? Card */}
        <Card className="p-6" data-testid="card-help-today">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">
                  How can we help today?
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Start with AI or talk to a GP
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={() => setLocation("/patient/intake")}
                data-testid="button-start-ai-chat"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start AI Chat or Consult a GP
              </Button>
              
              <Button
                variant="ghost"
                className="w-full"
                data-testid="button-ask-question"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Ask a Question
              </Button>
            </div>
          </div>
        </Card>

        {/* Ongoing Consultation Card (conditional) */}
        {ongoingConsultation && (
          <Card 
            className="p-4 hover-elevate active-elevate-2 cursor-pointer"
            onClick={() => setLocation("/patient/consult-waiting")}
            data-testid="card-ongoing-consultation"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Continue with {ongoingConsultation.doctorName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {ongoingConsultation.type} • ETA {ongoingConsultation.eta}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>
        )}

        {/* Quick Access Icons Row */}
        <div className="grid grid-cols-4 gap-4">
          {quickAccessItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setLocation(item.href)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover-elevate active-elevate-2"
                data-testid={`quick-access-${item.id}`}
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground text-center">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Nearby Pharmacies Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Nearby pharmacies
            </h3>
          </div>
          
          <div className="space-y-2">
            {nearbyPharmacies.map((pharmacy) => (
              <button
                key={pharmacy.id}
                className="w-full text-left p-4 rounded-lg hover-elevate active-elevate-2 bg-card"
                data-testid={`pharmacy-${pharmacy.id}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    {pharmacy.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {pharmacy.distance}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Educational Content Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Learn from trusted medical experts
          </h3>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {educationalVideos.map((video) => (
              <button
                key={video.id}
                className="flex-shrink-0 w-40 hover-elevate active-elevate-2"
                data-testid={`video-${video.id}`}
              >
                <div className="space-y-2">
                  <div className="aspect-video bg-primary/10 rounded-lg flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Play className="h-6 w-6 text-primary fill-primary" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground text-left">
                    {video.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PatientShell>
  );
}

import { useMemo, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { PatientShell } from "@/components/PatientShell";
import { FamilySwitcher, type FamilyMember } from "@/components/FamilySwitcher";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/StatusChip";
import {
  Sparkles,
  MessageCircle,
  Pill,
  Microscope,
  GraduationCap,
  UserCog,
  Loader2,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { api } from "@/lib/api";
import { getUserFromStorage } from "@/lib/storage";
import type { PrescriptionItem } from "@shared/schema";

export default function PatientHome() {
  const [, setLocation] = useLocation();

  const userData = getUserFromStorage() || {};
  const patientId = userData.id as string | undefined;
  const patientName = userData.name as string | undefined;

  const familyMembers: FamilyMember[] = [
    {
      id: "self",
      name: patientName ?? "You",
      relation: "Self",
      initial: patientName ? patientName.slice(0, 2).toUpperCase() : "ME",
    },
  ];

  const [activeMemberId, setActiveMemberId] = useState(familyMembers[0]?.id ?? "self");

  const {
    data: consults = [],
    isLoading: consultsLoading,
    error: consultsError,
  } = useQuery({
    queryKey: ["/api/consults", "patient", patientId],
    queryFn: () => api.consults.listConsults("patient", patientId!),
    enabled: !!patientId,
    refetchInterval: 15_000,
  });

  const {
    data: prescriptions = [],
    isLoading: prescriptionsLoading,
    error: prescriptionsError,
  } = useQuery({
    queryKey: ["/api/prescriptions", patientId],
    queryFn: () => api.prescriptions.list(patientId!),
    enabled: !!patientId,
  });

  const activeConsult = useMemo(() => {
    if (!consults.length) return undefined;
    return consults
      .slice()
      .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
      .find((consult) => consult.status !== "completed");
  }, [consults]);

  const latestPrescription = useMemo(() => {
    if (!prescriptions.length) return undefined;
    return prescriptions
      .slice()
      .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())[0];
  }, [prescriptions]);

  const notificationCount = (activeConsult ? 1 : 0) + (latestPrescription ? 1 : 0);

  return (
    <PatientShell notificationCount={notificationCount}>
      <div className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
        <FamilySwitcher members={familyMembers} activeMemberId={activeMemberId} onSwitch={setActiveMemberId} />

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">
                  {patientName ? `Hi ${patientName.split(" ")[0]},` : "Hi there,"} how can we help today?
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Start a new consult or continue your current one.</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full" size="lg" onClick={() => setLocation("/patient/intake")} data-testid="button-start-ai-chat">
                <Sparkles className="mr-2 h-5 w-5" />
                Start AI Triage & Request a GP
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setLocation("/patient/support")}
                data-testid="button-ask-question"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Ask a Question
              </Button>
            </div>
          </div>
        </Card>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Consultation status</h3>
            {consultsLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>

          {consultsError ? (
            <Card className="p-6">
              <p className="text-destructive text-sm">
                Unable to load consults right now. {consultsError instanceof Error ? consultsError.message : ""}
              </p>
            </Card>
          ) : activeConsult ? (
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Consult ID: {activeConsult.id}</p>
                  <h4 className="text-xl font-semibold text-foreground mt-1">Your request is in progress</h4>
                </div>
                <StatusChip status={activeConsult.status} />
              </div>
              <p className="text-sm text-foreground">{activeConsult.intakeSummary}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Updated {activeConsult.updatedAt ? new Date(activeConsult.updatedAt).toLocaleTimeString() : "just now"}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setLocation("/patient/consult-waiting")} data-testid="button-view-consult">
                  View consult progress
                </Button>
                {latestPrescription && activeConsult.status === "completed" && (
                  <Button variant="secondary" onClick={() => setLocation(`/patient/prescriptions/${latestPrescription.id}`)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    View new prescription
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center space-y-3">
              <h4 className="text-lg font-semibold text-foreground">No active consults</h4>
              <p className="text-muted-foreground text-sm">
                When you submit a new intake, you&apos;ll see the GP updates here in real time.
              </p>
              <Button onClick={() => setLocation("/patient/intake")} size="sm">
                Start a new consult
              </Button>
            </Card>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Latest prescriptions</h3>
            {prescriptionsLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          {prescriptionsError ? (
            <Card className="p-6">
              <p className="text-destructive text-sm">
                Unable to load prescriptions. {prescriptionsError instanceof Error ? prescriptionsError.message : ""}
              </p>
            </Card>
          ) : prescriptions.length === 0 ? (
            <Card className="p-6 text-sm text-muted-foreground">Prescriptions ordered by your GP will appear here.</Card>
          ) : (
            prescriptions.slice(0, 2).map((prescription) => {
              const items = ((prescription.items ?? []) as PrescriptionItem[]) ?? [];
              const issuedAt = prescription.createdAt ? new Date(prescription.createdAt) : null;

              return (
                <Card
                  key={prescription.id}
                  className="p-4 hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => setLocation(`/patient/prescriptions/${prescription.id}`)}
                  data-testid={`prescription-summary-${prescription.id}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-healthcare-prescription" />
                        <h4 className="font-semibold text-foreground">Prescription {prescription.id}</h4>
                        <StatusChip status={prescription.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Issued {issuedAt ? issuedAt.toLocaleDateString() : "recently"}
                      </p>
                      <ul className="space-y-0.5 text-xs text-foreground">
                        {items.slice(0, 2).map((item) => (
                          <li key={item.id}>
                            {item.name} - {item.dosage}, {item.frequency}
                          </li>
                        ))}
                        {items.length > 2 && <li>+ {items.length - 2} more</li>}
                      </ul>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              );
            })
          )}
        </section>

        <section className="grid sm:grid-cols-2 gap-4">
          <QuickAccessTile
            icon={<UserCog className="h-6 w-6 text-primary" />}
            label="Find specialists"
            description="Browse recommended partners"
            onClick={() => setLocation("/patient/specialists")}
          />
          <QuickAccessTile
            icon={<Microscope className="h-6 w-6 text-primary" />}
            label="Diagnostics"
            description="View or request lab work"
            onClick={() => setLocation("/patient/diagnostics")}
          />
          <QuickAccessTile
            icon={<Pill className="h-6 w-6 text-primary" />}
            label="My prescriptions"
            description="Review all medications"
            onClick={() => setLocation("/patient/prescriptions")}
          />
          <QuickAccessTile
            icon={<GraduationCap className="h-6 w-6 text-primary" />}
            label="Health education"
            description="Trusted articles & videos"
            onClick={() => setLocation("/patient")}
          />
        </section>
      </div>
    </PatientShell>
  );
}

interface QuickAccessTileProps {
  icon: ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}

function QuickAccessTile({ icon, label, description, onClick }: QuickAccessTileProps) {
  return (
    <button
      onClick={onClick}
      className="p-4 rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition shadow-sm bg-card text-left"
    >
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">{icon}</div>
        <div>
          <p className="font-semibold text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  );
}


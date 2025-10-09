import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/StatusChip";
import { ArrowLeft, Pill, ArrowRight, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { getUserFromStorage } from "@/lib/storage";
import type { PrescriptionItem } from "@shared/schema";

export default function Prescriptions() {
  const [, setLocation] = useLocation();

  const userData = getUserFromStorage() || {};
  const patientId = userData.id;

  const { data: prescriptions = [], isLoading, error } = useQuery({
    queryKey: ["/api/prescriptions", patientId],
    queryFn: () => api.prescriptions.list(patientId),
    enabled: !!patientId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/patient/home")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Prescriptions</h1>
              <p className="text-sm text-muted-foreground">View and manage your medications</p>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/patient/home")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Prescriptions</h1>
              <p className="text-sm text-muted-foreground">View and manage your medications</p>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="p-12 text-center">
            <p className="text-destructive">Error loading prescriptions: {error.message}</p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/patient/home")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Prescriptions</h1>
            <p className="text-sm text-muted-foreground">View and manage your medications</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {prescriptions.length === 0 ? (
          <Card className="p-12 text-center">
            <Pill className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Prescriptions</h3>
            <p className="text-muted-foreground">You don't have any prescriptions yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription) => {
              const issuedAt = prescription.createdAt ? new Date(prescription.createdAt) : null;
              const items = ((prescription.items ?? []) as PrescriptionItem[]) ?? [];

              return (
                <Card
                  key={prescription.id}
                  className="p-6 hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => setLocation(`/patient/prescriptions/${prescription.id}`)}
                  data-testid={`prescription-card-${prescription.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-healthcare-prescription/10 flex items-center justify-center flex-shrink-0">
                          <Pill className="h-5 w-5 text-healthcare-prescription" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">Prescription {prescription.id}</h3>
                            <StatusChip status={prescription.status} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Issued: {issuedAt ? issuedAt.toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="pl-13 space-y-1">
                        {items.map((item) => (
                          <p key={item.id} className="text-sm text-foreground">
                            <span className="font-medium">{item.name}</span> - {item.dosage}, {item.frequency}
                          </p>
                        ))}
                      </div>
                    </div>

                    <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-2" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}


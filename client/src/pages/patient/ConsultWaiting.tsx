import { useMemo, type ReactNode } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/StatusChip";
import { Clock, CheckCircle2, ArrowLeft, Loader2, Phone } from "lucide-react";
import { api } from "@/lib/api";
import { getUserFromStorage } from "@/lib/storage";

export default function ConsultWaiting() {
  const [, setLocation] = useLocation();
  const userData = getUserFromStorage() || {};
  const patientId = userData.id as string | undefined;

  const {
    data: consults = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/consults", "patient", patientId],
    queryFn: () => api.consults.listConsults("patient", patientId!),
    enabled: !!patientId,
    refetchInterval: 10_000,
  });

  const activeConsult = useMemo(() => {
    if (!consults.length) return undefined;
    return consults
      .slice()
      .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
      .find((consult) => consult.status !== "completed");
  }, [consults]);

  const lastCompleted = useMemo(() => {
    if (!consults.length) return undefined;
    return consults
      .slice()
      .sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime())
      .find((consult) => consult.status === "completed");
  }, [consults]);

  let headline = "Your request is queued";
  let description = "A GP will review your symptoms and connect with you shortly.";
  let highlightIcon = <Clock className="h-12 w-12 text-primary animate-pulse" />;

  if (activeConsult?.status === "in_progress") {
    headline = "A GP is reviewing your case";
    description = "Stay close to your phone — we'll call or WhatsApp you once it's time to connect.";
    highlightIcon = <Phone className="h-12 w-12 text-primary animate-pulse" />;
  }

  if (!activeConsult && lastCompleted) {
    headline = "Consultation completed";
    description = "Your GP has shared next steps and any prescriptions. You can review them below.";
    highlightIcon = <CheckCircle2 className="h-12 w-12 text-healthcare-completed" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/patient/home")} data-testid="button-back-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-2xl space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <Card className="p-8 text-center space-y-3">
            <h1 className="text-2xl font-bold text-destructive">Unable to load your consult status.</h1>
            <p className="text-muted-foreground text-sm">
              {error instanceof Error ? error.message : "Please try again in a few moments."}
            </p>
          </Card>
        ) : activeConsult ? (
          <ConsultStatusCard consultId={activeConsult.id} status={activeConsult.status} headline={headline} description={description}>
            {highlightIcon}
          </ConsultStatusCard>
        ) : lastCompleted ? (
          <CompletedConsultCard consultId={lastCompleted.id} onViewPrescription={() => setLocation("/patient/prescriptions")} />
        ) : (
          <Card className="p-8 text-center space-y-4">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto" />
            <h1 className="text-3xl font-bold text-foreground">No active consults</h1>
            <p className="text-muted-foreground text-sm">
              Start a new intake to connect with a GP. You’ll see live updates here as soon as they review your symptoms.
            </p>
            <Button onClick={() => setLocation("/patient/intake")} data-testid="button-start-new" size="lg">
              Start a new intake
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}

interface ConsultStatusCardProps {
  consultId: string;
  status: string;
  headline: string;
  description: string;
  children: ReactNode;
}

function ConsultStatusCard({ consultId, status, headline, description, children }: ConsultStatusCardProps) {
  return (
    <Card className="p-8 md:p-12 text-center space-y-8">
      <div className="flex justify-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">{children}</div>
          <div className="absolute -bottom-1 -right-1">
            <StatusChip status={status} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{headline}</h1>
        <p className="text-muted-foreground text-base">{description}</p>
        <p className="text-xs font-mono text-muted-foreground/80">Consult #{consultId}</p>
      </div>

      <div className="bg-muted/50 rounded-lg p-6 space-y-3 text-left">
        <h3 className="font-semibold text-foreground">What happens next?</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-xs font-medium text-primary">1</span>
            </div>
            <span>Your GP reviews your intake and may send a WhatsApp follow-up for clarification.</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-xs font-medium text-primary">2</span>
            </div>
            <span>We notify you instantly when a GP is ready to speak or has shared next steps.</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
              <span className="text-xs font-medium text-primary">3</span>
            </div>
            <span>Any prescriptions or referrals will appear in your dashboard automatically.</span>
          </li>
        </ul>
      </div>

      <div className="pt-2">
        <Button variant="outline" onClick={() => window.history.back()}>
          Return to previous page
        </Button>
      </div>
    </Card>
  );
}

interface CompletedConsultCardProps {
  consultId: string;
  onViewPrescription: () => void;
}

function CompletedConsultCard({ consultId, onViewPrescription }: CompletedConsultCardProps) {
  return (
    <Card className="p-8 md:p-12 text-center space-y-6">
      <div className="flex justify-center">
        <div className="h-24 w-24 rounded-full bg-healthcare-completed/10 flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-healthcare-completed" />
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Consultation completed</h1>
        <p className="text-muted-foreground">
          Your GP has wrapped up consult #{consultId}. Review prescriptions, referrals, or diagnostic orders next.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={onViewPrescription} size="lg">
          View prescriptions
        </Button>
        <Button variant="outline" onClick={() => window.history.back()} size="lg">
          Back to home
        </Button>
      </div>
    </Card>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TabNav, type Tab } from "@/components/TabNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/StatusChip";
import { StaticChatThread } from "@/components/StaticChatThread";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Inbox,
  CheckCircle2,
  MessageSquare,
  History,
  User,
  LogOut,
  Clock,
  Loader2,
  Stethoscope,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { getUserFromStorage } from "@/lib/storage";
import type { Consult, PrescriptionItem, User as DomainUser, IntakeFormData } from "@shared/schema";

type PrescriptionDraftItem = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  quantity: string;
  duration: string;
  instructions?: string;
};

const createDraftItem = (): PrescriptionDraftItem => ({
  id: `item-${
    typeof globalThis.crypto !== "undefined" && "randomUUID" in globalThis.crypto
      ? globalThis.crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  }`,
  name: "",
  dosage: "",
  frequency: "",
  quantity: "",
  duration: "",
  instructions: "",
});

const tabs: Tab[] = [
  { id: "live", label: "Live Requests", href: "/gp", icon: <Inbox className="h-5 w-5" /> },
  { id: "completed", label: "Completed", href: "/gp", icon: <CheckCircle2 className="h-5 w-5" /> },
  { id: "chats", label: "Chats", href: "/gp", icon: <MessageSquare className="h-5 w-5" /> },
  { id: "history", label: "History", href: "/gp", icon: <History className="h-5 w-5" /> },
  { id: "profile", label: "Profile", href: "/gp", icon: <User className="h-5 w-5" /> },
];

export default function GPPortal() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const userData = getUserFromStorage() || {};
  const userId = userData.id as string | undefined;
  const role = userData.role as "gp" | undefined;

  const { data: consults = [], isLoading, error } = useQuery({
    queryKey: ["/api/consults", role, userId],
    queryFn: () => api.consults.listConsults(role!, userId!),
    enabled: !!userId && role === "gp",
  });

  const { data: specialists = [] } = useQuery({
    queryKey: ["/api/users", "specialist"],
    queryFn: () => api.users.list("specialist"),
    enabled: role === "gp",
  });

  const [selectedConsultForPrescription, setSelectedConsultForPrescription] = useState<Consult | null>(null);
  const [selectedConsultForReferral, setSelectedConsultForReferral] = useState<Consult | null>(null);

  const acceptConsultMutation = useMutation({
    mutationFn: (consultId: string) => api.consults.accept(consultId, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/consults", role, userId] });
      toast({ title: "Consult accepted", description: "The patient has been assigned to you." });
    },
    onError: (err: any) => {
      toast({
        title: "Unable to accept consult",
        description: err?.message ?? "Please try again in a moment.",
        variant: "destructive",
      });
    },
  });

  const createPrescriptionMutation = useMutation({
    mutationFn: ({ consultId, patientId, items }: { consultId: string; patientId: string; items: PrescriptionItem[] }) =>
      api.consults.createPrescription(consultId, { gpId: userId, items }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/consults", role, userId] });
      queryClient.invalidateQueries({ queryKey: ["/api/prescriptions", variables.patientId] });
      toast({ title: "Prescription created", description: "The patient can now view their medication plan." });
      setSelectedConsultForPrescription(null);
    },
    onError: (err: any) => {
      toast({
        title: "Prescription failed",
        description: err?.message ?? "Unable to create prescription.",
        variant: "destructive",
      });
    },
  });

  const referralMutation = useMutation({
    mutationFn: ({
      consult,
      specialistId,
      reason,
      notes,
    }: {
      consult: Consult;
      specialistId: string;
      reason: string;
      notes?: string;
    }) =>
      api.referrals.create({
        gpId: userId!,
        patientId: consult.patientId,
        specialistId,
        reason,
        notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/referrals"] });
      toast({ title: "Referral sent", description: "The specialist has been notified." });
      setSelectedConsultForReferral(null);
    },
    onError: (err: any) => {
      toast({
        title: "Referral failed",
        description: err?.message ?? "Unable to send referral.",
        variant: "destructive",
      });
    },
  });

  const activeConsultForChat = useMemo(() => {
    if (!consults.length) return undefined;
    const assigned = consults.find((consult) => consult.gpId === userId && consult.status === "in_progress");
    return assigned?.id ?? consults[0]?.id;
  }, [consults, userId]);

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/consults", activeConsultForChat, "messages"],
    queryFn: () => api.messages.list(activeConsultForChat!),
    enabled: !!activeConsultForChat,
  });

  const liveConsults = useMemo(() => consults.filter((consult) => consult.status !== "completed"), [consults]);

  const handleLogout = () => {
    localStorage.removeItem("mediconnect_user");
    setLocation("/");
  };

  const handleAcceptConsult = (consultId: string) => {
    acceptConsultMutation.mutate(consultId);
  };

  const handlePrescriptionSubmit = (consult: Consult, items: PrescriptionItem[]) => {
    createPrescriptionMutation.mutate({ consultId: consult.id, patientId: consult.patientId, items });
  };

  const handleReferralSubmit = (
    consult: Consult,
    payload: { specialistId: string; reason: string; notes?: string },
  ) => {
    referralMutation.mutate({ consult, ...payload });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">GP Portal</h1>
            <p className="text-sm text-muted-foreground">Manage live consults and referrals in real time.</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <TabNav tabs={tabs} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <Card className="p-12 text-center">
            <p className="text-destructive">Error loading consults: {(error as Error).message}</p>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Live Consultation Requests</h2>
                <span className="text-sm text-muted-foreground">{liveConsults.length} active</span>
              </div>

              {liveConsults.length === 0 ? (
                <Card className="p-12 text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">No active consults</h3>
                  <p className="text-muted-foreground">New patient intake requests will appear here in real time.</p>
                </Card>
              ) : (
                liveConsults.map((consult) => {
                  const intakeData = consult.intakeData as IntakeFormData | null;
                  const isAssignedToMe = consult.gpId === userId;
                  const accepting = acceptConsultMutation.isPending && acceptConsultMutation.variables === consult.id;
                  const isQueued = consult.status === "queued" || consult.status === "intake";
                  const canAction = isAssignedToMe && consult.status === "in_progress";

                  return (
                    <Card key={consult.id} className="p-6 hover-elevate space-y-4" data-testid={`consult-${consult.id}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-foreground">Consult {consult.id}</h3>
                            <StatusChip status={consult.status} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Submitted {consult.createdAt ? new Date(consult.createdAt).toLocaleString() : "N/A"}
                          </p>
                          <p className="text-sm text-foreground">{consult.intakeSummary}</p>
                          {intakeData?.symptoms && (
                            <p className="text-xs text-muted-foreground">
                              Symptoms: {intakeData.symptoms} - Severity: {intakeData.severity}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div className="flex items-center gap-1 justify-end">
                            <Clock className="h-3 w-3" />
                            {consult.updatedAt ? new Date(consult.updatedAt).toLocaleTimeString() : "Just now"}
                          </div>
                          <p className="mt-1">
                            {consult.gpId ? (isAssignedToMe ? "Assigned to you" : `Assigned to ${consult.gpId}`) : "Unassigned"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {isQueued && (
                          <Button
                            size="sm"
                            onClick={() => handleAcceptConsult(consult.id)}
                            disabled={accepting}
                            data-testid={`button-accept-${consult.id}`}
                          >
                            {accepting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Accepting...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Accept Consult
                              </>
                            )}
                          </Button>
                        )}

                        {canAction && (
                          <>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setSelectedConsultForPrescription(consult)}
                              data-testid={`button-prescribe-${consult.id}`}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Create Prescription
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedConsultForReferral(consult)}
                              data-testid={`button-refer-${consult.id}`}
                            >
                              <Stethoscope className="mr-2 h-4 w-4" />
                              Refer to Specialist
                            </Button>
                          </>
                        )}
                      </div>
                    </Card>
                  );
                })
              )}
            </div>

            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Consult Messages</h3>
                  {activeConsultForChat && (
                    <span className="text-xs text-muted-foreground font-mono">#{activeConsultForChat}</span>
                  )}
                </div>
                {messagesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <StaticChatThread messages={messages} currentUserId={userId} />
                )}
              </Card>
            </div>
          </div>
        )}
      </main>

      <PrescriptionDialog
        consult={selectedConsultForPrescription}
        open={!!selectedConsultForPrescription}
        onOpenChange={(open) => !open && setSelectedConsultForPrescription(null)}
        onSubmit={(items) => selectedConsultForPrescription && handlePrescriptionSubmit(selectedConsultForPrescription, items)}
        isSubmitting={createPrescriptionMutation.isPending}
        toast={toast}
      />

      <ReferralDialog
        consult={selectedConsultForReferral}
        open={!!selectedConsultForReferral}
        onOpenChange={(open) => !open && setSelectedConsultForReferral(null)}
        specialists={specialists}
        onSubmit={(payload) => selectedConsultForReferral && handleReferralSubmit(selectedConsultForReferral, payload)}
        isSubmitting={referralMutation.isPending}
        toast={toast}
      />
    </div>
  );
}

interface PrescriptionDialogProps {
  consult: Consult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (items: PrescriptionItem[]) => void;
  isSubmitting: boolean;
  toast: ReturnType<typeof useToast>["toast"];
}

function PrescriptionDialog({ consult, open, onOpenChange, onSubmit, isSubmitting, toast }: PrescriptionDialogProps) {
  const [items, setItems] = useState<PrescriptionDraftItem[]>([createDraftItem()]);

  useEffect(() => {
    if (open) {
      setItems([createDraftItem()]);
    }
  }, [open, consult?.id]);

  const updateItem = (id: string, field: keyof PrescriptionDraftItem, value: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addItem = () => setItems((prev) => [...prev, createDraftItem()]);
  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = items.map((item) => ({
      ...item,
      name: item.name.trim(),
      dosage: item.dosage.trim(),
      frequency: item.frequency.trim(),
      quantity: item.quantity.trim(),
      duration: item.duration.trim(),
      instructions: item.instructions?.trim() ?? "",
    }));

    const hasMissing = normalized.some(
      (item) => !item.name || !item.dosage || !item.frequency || !item.quantity || !item.duration,
    );

    if (hasMissing) {
      toast({
        title: "Add medication details",
        description: "Each prescription item must include name, dosage, frequency, quantity, and duration.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(
      normalized.map((item) => ({
        id: item.id,
        name: item.name,
        dosage: item.dosage,
        frequency: item.frequency,
        quantity: item.quantity,
        duration: item.duration,
        instructions: item.instructions,
      })),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Create prescription</DialogTitle>
            <DialogDescription>
              Document the treatment plan for consult {consult?.id}. The patient will see these medications immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {items.map((item, index) => (
              <Card key={item.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">Medication {index + 1}</h4>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove medication"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor={`name-${item.id}`}>Name</Label>
                    <Input
                      id={`name-${item.id}`}
                      value={item.name}
                      onChange={(e) => updateItem(item.id, "name", e.target.value)}
                      placeholder="e.g., Amoxicillin"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`dosage-${item.id}`}>Dosage</Label>
                    <Input
                      id={`dosage-${item.id}`}
                      value={item.dosage}
                      onChange={(e) => updateItem(item.id, "dosage", e.target.value)}
                      placeholder="500mg"
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor={`frequency-${item.id}`}>Frequency</Label>
                    <Input
                      id={`frequency-${item.id}`}
                      value={item.frequency}
                      onChange={(e) => updateItem(item.id, "frequency", e.target.value)}
                      placeholder="3 times daily"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                    <Input
                      id={`quantity-${item.id}`}
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                      placeholder="21 tablets"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`duration-${item.id}`}>Duration</Label>
                  <Input
                    id={`duration-${item.id}`}
                    value={item.duration}
                    onChange={(e) => updateItem(item.id, "duration", e.target.value)}
                    placeholder="7 days"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`instructions-${item.id}`}>Instructions (optional)</Label>
                  <Textarea
                    id={`instructions-${item.id}`}
                    value={item.instructions}
                    onChange={(e) => updateItem(item.id, "instructions", e.target.value)}
                    placeholder="Take with food, avoid alcohol..."
                  />
                </div>
              </Card>
            ))}
            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add another medication
            </Button>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Save prescription
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface ReferralDialogProps {
  consult: Consult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialists: DomainUser[];
  onSubmit: (payload: { specialistId: string; reason: string; notes?: string }) => void;
  isSubmitting: boolean;
  toast: ReturnType<typeof useToast>["toast"];
}

function ReferralDialog({
  consult,
  open,
  onOpenChange,
  specialists,
  onSubmit,
  isSubmitting,
  toast,
}: ReferralDialogProps) {
  const [formState, setFormState] = useState<{ specialistId: string; reason: string; notes: string }>({
    specialistId: "",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    if (open) {
      setFormState({ specialistId: "", reason: "", notes: "" });
    }
  }, [open, consult?.id]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.specialistId || !formState.reason.trim()) {
      toast({
        title: "Add referral details",
        description: "Select a specialist and describe why the patient needs the referral.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      specialistId: formState.specialistId,
      reason: formState.reason.trim(),
      notes: formState.notes.trim() || undefined,
    });
  };

  const noSpecialists = specialists.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Refer to a specialist</DialogTitle>
            <DialogDescription>
              Share the patient context and choose the most appropriate specialist to continue the care journey.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="specialist">Specialist</Label>
              <Select
                value={formState.specialistId}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, specialistId: value }))}
                disabled={noSpecialists}
              >
                <SelectTrigger id="specialist">
                  <SelectValue placeholder={noSpecialists ? "No specialists available" : "Select specialist"} />
                </SelectTrigger>
                <SelectContent>
                  {specialists.map((specialist) => {
                    const metadata = (specialist.metadata as { specialty?: string } | null) ?? null;
                    return (
                      <SelectItem key={specialist.id} value={specialist.id}>
                        {specialist.name}
                        {metadata?.specialty ? ` — ${metadata.specialty}` : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reason">Reason for referral</Label>
              <Textarea
                id="reason"
                value={formState.reason}
                onChange={(e) => setFormState((prev) => ({ ...prev, reason: e.target.value }))}
                placeholder="Describe symptoms, findings, or goals for the specialist."
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Additional notes (optional)</Label>
              <Textarea
                id="notes"
                value={formState.notes}
                onChange={(e) => setFormState((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Share any relevant history, attachments, etc."
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || noSpecialists}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Send referral
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

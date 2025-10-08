import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/StatusChip";
import { QRPanel } from "@/components/QRPanel";
import { ArrowLeft, Download, Pill, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

export default function PrescriptionDetail() {
  const [, params] = useRoute("/patient/prescriptions/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const prescriptionId = params?.id || "";

  const { data: prescription, isLoading, error } = useQuery({
    queryKey: ["/api/prescriptions", prescriptionId],
    queryFn: () => api.prescriptions.get(prescriptionId),
    enabled: !!prescriptionId
  });

  const downloadPdfMutation = useMutation({
    mutationFn: () => api.prescriptions.downloadPdf(prescriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prescriptions", prescriptionId] });
      toast({
        title: "PDF Downloaded",
        description: "QR code has been disabled for security",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Download Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleDownloadPdf = () => {
    downloadPdfMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/patient/prescriptions")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Prescription {params?.id}</h1>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !prescription) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/patient/prescriptions")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Prescription {params?.id}</h1>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <Card className="p-12 text-center">
            <p className="text-destructive">Error loading prescription</p>
          </Card>
        </main>
      </div>
    );
  }

  const items = prescription.items as any[];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/patient/prescriptions")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Prescription {params?.id}</h1>
            <p className="text-sm text-muted-foreground">Issued: {prescription.createdAt ? new Date(prescription.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Prescription Details</h2>
                <StatusChip status={prescription.status} />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Issued Date</p>
                    <p className="font-medium text-foreground">{prescription.createdAt ? new Date(prescription.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium text-foreground capitalize">{prescription.status}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Medications</h2>
              <div className="space-y-4">
                {items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="border border-border rounded-lg p-4 space-y-3"
                    data-testid={`medication-${idx}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-healthcare-prescription/10 flex items-center justify-center flex-shrink-0">
                        <Pill className="h-5 w-5 text-healthcare-prescription" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.dosage}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Frequency</p>
                        <p className="font-medium text-foreground">{item.frequency}</p>
                      </div>
                      {item.duration && (
                        <div>
                          <p className="text-muted-foreground">Duration</p>
                          <p className="font-medium text-foreground">{item.duration}</p>
                        </div>
                      )}
                    </div>
                    {item.instructions && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-sm text-muted-foreground">Instructions:</p>
                        <p className="text-sm text-foreground">{item.instructions}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <QRPanel
              prescriptionId={prescription.id}
              qrToken={prescription.qrDisabled ? undefined : (prescription.qrToken || undefined)}
              disabledReason={prescription.qrDisabled ? "QR disabled after PDF download" : undefined}
            />

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Actions</h3>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDownloadPdf}
                disabled={!!prescription.qrDisabled || downloadPdfMutation.isPending}
                data-testid="button-download-pdf"
              >
                {downloadPdfMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
              {prescription.qrDisabled && (
                <p className="text-xs text-muted-foreground">
                  PDF downloaded. QR code is now disabled for security.
                </p>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  QrCode, 
  LogOut,
  CheckCircle2,
  Pill,
  AlertCircle,
  Loader2
} from "lucide-react";
import { api } from "@/lib/api";

export default function PharmacyScanner() {
  const [, setLocation] = useLocation();
  const [qrToken, setQrToken] = useState("");
  const [verifiedData, setVerifiedData] = useState<any>(null);

  const handleLogout = () => {
    localStorage.removeItem("mediconnect_user");
    setLocation("/");
  };

  const verifyMutation = useMutation({
    mutationFn: (token: string) => api.pharmacy.verifyQr(token),
    onSuccess: (data) => {
      setVerifiedData(data);
    }
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    verifyMutation.mutate(qrToken);
  };

  const handleReset = () => {
    setQrToken("");
    setVerifiedData(null);
    verifyMutation.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pharmacy Portal</h1>
            <p className="text-sm text-muted-foreground">HealthCare Pharmacy</p>
          </div>
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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!verifiedData ? (
          <Card className="p-8">
            <div className="text-center mb-8 space-y-2">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-healthcare-prescription/10 flex items-center justify-center">
                  <QrCode className="h-8 w-8 text-healthcare-prescription" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Scan Prescription QR</h2>
              <p className="text-muted-foreground">Enter the QR token to verify and dispense</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="qr-token">QR Token</Label>
                <Input
                  id="qr-token"
                  type="text"
                  placeholder="Paste QR token here"
                  value={qrToken}
                  onChange={(e) => setQrToken(e.target.value)}
                  data-testid="input-qr-token"
                  className="text-center text-lg font-mono"
                  required
                />
                <p className="text-xs text-muted-foreground text-center">
                  Try: QR-ABC123XYZ789 (demo token)
                </p>
              </div>

              {verifyMutation.error && (
                <div className="bg-destructive/10 border border-destructive/40 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{(verifyMutation.error as any).message}</p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                data-testid="button-verify"
                disabled={verifyMutation.isPending}
              >
                {verifyMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Prescription"
                )}
              </Button>
            </form>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-6 bg-accent/20 border-accent">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-accent-foreground" />
                <div>
                  <h2 className="text-xl font-semibold text-accent-foreground">Prescription Verified</h2>
                  <p className="text-sm text-accent-foreground/80">
                    Prescription ID: <span className="font-mono">{verifiedData.prescriptionId}</span>
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Items to Dispense</h3>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                  NO PATIENT DETAILS
                </span>
              </div>

              <div className="space-y-4">
                {verifiedData.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="border border-border rounded-lg p-4"
                    data-testid={`pharmacy-item-${item.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-healthcare-prescription/10 flex items-center justify-center flex-shrink-0">
                        <Pill className="h-5 w-5 text-healthcare-prescription" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-lg">{item.name}</h4>
                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Dosage</p>
                            <p className="font-medium text-foreground">{item.dosage}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Quantity</p>
                            <p className="font-medium text-foreground">{item.quantity}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Frequency</p>
                            <p className="font-medium text-foreground">{item.frequency}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium text-foreground">{item.duration}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border flex gap-3">
                <Button
                  className="flex-1"
                  size="lg"
                  data-testid="button-dispense"
                  onClick={handleReset}
                >
                  Mark as Dispensed
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleReset}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

import { QrCode, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QRPanelProps {
  qrToken?: string;
  disabledReason?: string;
  className?: string;
}

export function QRPanel({ qrToken, disabledReason, className }: QRPanelProps) {
  const isDisabled = !!disabledReason;

  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">QR Code</h3>
          {isDisabled && (
            <span className="text-xs font-medium text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Disabled
            </span>
          )}
        </div>

        <div
          className={cn(
            "aspect-square max-w-sm mx-auto rounded-lg flex items-center justify-center transition-all",
            isDisabled
              ? "border-2 border-dashed border-muted bg-muted/30"
              : "border-2 border-primary bg-primary/5"
          )}
          data-testid="qr-panel"
        >
          {isDisabled ? (
            <div className="text-center p-6 space-y-2">
              <QrCode className="h-16 w-16 text-muted-foreground mx-auto opacity-30" />
              <p className="text-sm text-muted-foreground">{disabledReason}</p>
            </div>
          ) : qrToken ? (
            <div className="text-center p-4">
              <div className="bg-white p-4 rounded-lg inline-block">
                <QrCode className="h-32 w-32 text-primary" data-testid="qr-code-active" />
                <p className="text-xs text-muted-foreground mt-2 font-mono">{qrToken.slice(0, 8)}...</p>
              </div>
            </div>
          ) : (
            <div className="text-center p-6">
              <QrCode className="h-16 w-16 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">Generating QR code...</p>
            </div>
          )}
        </div>

        {!isDisabled && (
          <p className="text-xs text-center text-muted-foreground">
            Show this QR code to the pharmacy to dispense your prescription
          </p>
        )}
      </div>
    </Card>
  );
}

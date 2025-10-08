import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ConsultWaiting() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/patient/home")}
            data-testid="button-back-home"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="p-8 md:p-12 text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-12 w-12 text-primary animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-accent flex items-center justify-center border-4 border-background">
                <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">
              Your Request is Queued
            </h1>
            <p className="text-lg text-muted-foreground">
              A GP will review your symptoms and connect with you shortly
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-3 text-left">
            <h3 className="font-semibold text-foreground">What happens next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-xs font-medium text-primary">1</span>
                </div>
                <span>A GP will review your intake within 15-30 minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-xs font-medium text-primary">2</span>
                </div>
                <span>You'll receive a WhatsApp notification when they're ready</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-xs font-medium text-primary">3</span>
                </div>
                <span>Consultation will happen via WhatsApp video or chat</span>
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/patient/home")}
              data-testid="button-return-home"
            >
              Return to Home
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}

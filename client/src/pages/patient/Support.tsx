import { PatientShell } from "@/components/PatientShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle } from "lucide-react";

export default function Support() {
  const { toast } = useToast();

  const handleOpenWhatsApp = () => {
    const phoneNumber = "254700123456";
    const message = encodeURIComponent("Hello, I need support with Mediconnect");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleReportIssue = () => {
    toast({
      title: "Coming soon",
      description: "Issue reporting will be available in a future update.",
    });
  };

  return (
    <PatientShell>
      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-4">
        {/* WhatsApp Support Card */}
        <Card data-testid="card-whatsapp-support">
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center space-y-4">
            {/* Green circular icon background */}
            <div 
              className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
              data-testid="icon-whatsapp-container"
            >
              <MessageCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-foreground" data-testid="text-whatsapp-title">
              WhatsApp Support
            </h2>

            {/* Description */}
            <p className="text-sm text-muted-foreground max-w-md" data-testid="text-whatsapp-description">
              You'll be redirected to WhatsApp. Our team replies within ~10 minutes (9am–8pm).
            </p>

            {/* Button */}
            <Button
              className="w-full"
              onClick={handleOpenWhatsApp}
              data-testid="button-open-whatsapp"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Open WhatsApp chat
            </Button>
          </CardContent>
        </Card>

        {/* Alternative Support Card */}
        <Card data-testid="card-alternative-support">
          <CardContent className="pt-6 pb-6 space-y-4">
            {/* Title */}
            <h3 className="font-bold text-foreground" data-testid="text-alternative-title">
              Can't use WhatsApp?
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground" data-testid="text-alternative-description">
              If WhatsApp is unavailable on your device, you can report an issue instead.
            </p>

            {/* Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleReportIssue}
              data-testid="button-report-issue"
            >
              Report an issue
            </Button>
          </CardContent>
        </Card>

        {/* Support Hours Card */}
        <Card data-testid="card-support-hours">
          <CardContent className="pt-6 pb-6 space-y-4">
            {/* Title */}
            <h3 className="font-bold text-foreground" data-testid="text-hours-title">
              Support Hours
            </h3>

            {/* Schedule List */}
            <div className="space-y-2" data-testid="list-support-hours">
              <p className="text-sm text-foreground">
                Monday - Friday: 9:00 AM - 8:00 PM
              </p>
              <p className="text-sm text-foreground">
                Saturday: 10:00 AM - 6:00 PM
              </p>
              <p className="text-sm text-foreground">
                Sunday: Closed
              </p>
            </div>

            {/* Emergency Note */}
            <p className="text-xs text-muted-foreground" data-testid="text-emergency-note">
              Emergency support available 24/7 for urgent medical issues.
            </p>
          </CardContent>
        </Card>
      </div>
    </PatientShell>
  );
}

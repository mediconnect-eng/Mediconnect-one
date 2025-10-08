import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, FileText, Shield, Heart } from "lucide-react";

export default function TermsConsent() {
  const [, setLocation] = useLocation();
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [telemedicineChecked, setTelemedicineChecked] = useState(false);

  const allChecked = termsChecked && privacyChecked && telemedicineChecked;

  const handleAccept = () => {
    if (allChecked) {
      setLocation("/patient/home");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
            data-testid="button-back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Terms & consent</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Document Icon */}
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-12 w-12 text-primary" />
            </div>
          </div>

          {/* Page Title */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground" data-testid="text-page-title">
              Terms and consent
            </h2>
            <p className="text-sm text-muted-foreground" data-testid="text-page-description">
              Please review and accept the following to continue
            </p>
          </div>

          {/* Policy Cards */}
          <div className="space-y-4">
            {/* Privacy Policy Card */}
            <Card className="p-4" data-testid="card-privacy-policy">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-foreground">Privacy Policy</h3>
                  <p className="text-sm text-muted-foreground">
                    We collect and process your health data to provide medical services. Your data is encrypted and secure. We don't share personal information without your consent, except where required by law.
                  </p>
                </div>
              </div>
            </Card>

            {/* Telemedicine Terms Card */}
            <Card className="p-4" data-testid="card-telemedicine-terms">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-foreground">Telemedicine Terms</h3>
                  <p className="text-sm text-muted-foreground">
                    Telemedicine consultations have limitations. Emergency services should be contacted for urgent medical needs.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3" data-testid="checkbox-terms-wrapper">
              <Checkbox
                id="terms"
                checked={termsChecked}
                onCheckedChange={(checked) => setTermsChecked(checked === true)}
                data-testid="checkbox-terms"
              />
              <label
                htmlFor="terms"
                className="text-sm text-foreground leading-relaxed cursor-pointer"
              >
                I have read and agree to the{" "}
                <a
                  href="/legal/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-terms"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of Service
                </a>
              </label>
            </div>

            <div className="flex items-start gap-3" data-testid="checkbox-privacy-wrapper">
              <Checkbox
                id="privacy"
                checked={privacyChecked}
                onCheckedChange={(checked) => setPrivacyChecked(checked === true)}
                data-testid="checkbox-privacy"
              />
              <label
                htmlFor="privacy"
                className="text-sm text-foreground leading-relaxed cursor-pointer"
              >
                I have read and agree to the{" "}
                <a
                  href="/legal/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-privacy"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            <div className="flex items-start gap-3" data-testid="checkbox-telemedicine-wrapper">
              <Checkbox
                id="telemedicine"
                checked={telemedicineChecked}
                onCheckedChange={(checked) => setTelemedicineChecked(checked === true)}
                data-testid="checkbox-telemedicine"
              />
              <label
                htmlFor="telemedicine"
                className="text-sm text-foreground leading-relaxed cursor-pointer"
              >
                I understand and consent to{" "}
                <a
                  href="/legal/terms#telemedicine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-telemedicine"
                  onClick={(e) => e.stopPropagation()}
                >
                  telemedicine limitations
                </a>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            className="w-full"
            size="lg"
            disabled={!allChecked}
            onClick={handleAccept}
            data-testid="button-accept-continue"
          >
            Accept and continue
          </Button>

          {/* Footer Text */}
          <p className="text-xs text-center text-muted-foreground pt-2" data-testid="text-footer">
            By continuing, you agree to all terms and consent to data processing
          </p>
        </div>
      </main>
    </div>
  );
}

import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-8 md:p-12">
          <h1 className="text-3xl font-bold text-foreground mb-6">Terms of Service</h1>
          
          <div className="prose prose-sm max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Mediconnect, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Use of Service</h2>
              <p className="text-muted-foreground">
                Mediconnect provides a platform connecting patients with healthcare providers. This is a demonstration environment and should not be used for actual medical consultations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Privacy and Data Protection</h2>
              <p className="text-muted-foreground">
                We are committed to protecting your privacy. Please review our Privacy Policy to understand how we collect, use, and safeguard your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Medical Disclaimer</h2>
              <p className="text-muted-foreground">
                This platform is for demonstration purposes only. Always consult with qualified healthcare professionals for medical advice, diagnosis, or treatment.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Modifications to Service</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify or discontinue the service at any time without notice.
              </p>
            </section>

            <p className="text-sm text-muted-foreground pt-6 border-t border-border">
              Last Updated: January 2024
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}

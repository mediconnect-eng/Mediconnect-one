import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
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
          <h1 className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>
          
          <div className="prose prose-sm max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground">
                We collect information necessary to provide healthcare services, including personal details, health information, and usage data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="text-muted-foreground">
                Your information is used to facilitate healthcare consultations, maintain medical records, and improve our services. We implement strict access controls and data minimization principles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Data Sharing</h2>
              <p className="text-muted-foreground">
                We share your health information only with authorized healthcare providers involved in your care. Pharmacies receive prescription details without personal identifying information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Security Measures</h2>
              <p className="text-muted-foreground">
                We employ industry-standard security measures including encryption, access controls, and regular security audits to protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
              <p className="text-muted-foreground">
                You have the right to access, correct, or delete your personal information. You can also manage your consent preferences in your profile settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your health records as required by law and medical best practices. You can request deletion subject to legal and regulatory requirements.
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

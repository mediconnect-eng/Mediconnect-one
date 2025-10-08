import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Intake() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    symptoms: "",
    duration: "",
    severity: "",
    medications: "",
    allergies: ""
  });

  const userData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("mediconnect_user") || "{}") : {};
  const patientId = userData.id;

  const submitIntakeMutation = useMutation({
    mutationFn: async () => {
      const consult = await api.consults.startIntake(patientId, formData);
      await api.consults.queueConsult(consult.id);
      return consult;
    },
    onSuccess: () => {
      setLocation("/patient/consult-waiting");
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitIntakeMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/patient/home")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Health Intake</h1>
          <p className="text-muted-foreground">
            Tell us about your symptoms so we can connect you with the right healthcare provider
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="symptoms">What symptoms are you experiencing?</Label>
              <Textarea
                id="symptoms"
                placeholder="Describe your symptoms in detail..."
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                data-testid="input-symptoms"
                className="min-h-32"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="duration">How long have you had these symptoms?</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 3 days, 2 weeks"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  data-testid="input-duration"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity level</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) => setFormData({ ...formData, severity: value })}
                  required
                >
                  <SelectTrigger id="severity" data-testid="select-severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medications">Current medications (optional)</Label>
              <Input
                id="medications"
                placeholder="List any medications you're taking"
                value={formData.medications}
                onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                data-testid="input-medications"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Known allergies (optional)</Label>
              <Input
                id="allergies"
                placeholder="List any known allergies"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                data-testid="input-allergies"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              data-testid="button-submit-intake"
              disabled={submitIntakeMutation.isPending}
            >
              {submitIntakeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Submit & Connect with GP
                </>
              )}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}

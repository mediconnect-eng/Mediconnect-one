import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  ChevronLeft, 
  Download, 
  Share2, 
  Pill,
  Activity,
  Thermometer,
  Heart,
  Scale
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function VisitSummary() {
  const [, params] = useRoute("/patient/visits/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);

  // Mock data based on the PDF design
  const visitData = {
    id: params?.id || "1",
    doctorName: "Dr. Michael Chen",
    doctorInitial: "D",
    specialty: "Cardiologist",
    date: "Nov",
    year: "2024",
    status: "Completed",
    duration: "45 minutes",
    chiefComplaint: "Follow-up consultation for chest pain",
    clinicalAssessment: `Patient presenting with intermittent chest pain radiating to left arm. Pain described as pressure-like, lasting 5-10 minutes. No associated shortness of breath. Vital signs stable. Blood pressure within normal limits (120/80 mmHg). EKG indicates normal sinus rhythm with no signs of ischemia.`,
    diagnosis: "Anxiety-related chest pain (Non-cardiac chest pain)",
    vitalSigns: [
      { icon: Activity, label: "Blood Pressure", value: "120/80 mmHg" },
      { icon: Heart, label: "Heart Rate", value: "75 bpm" },
      { icon: Thermometer, label: "Temperature", value: "98.6°F" },
      { icon: Scale, label: "Weight", value: "165 lbs" },
    ],
    treatmentPlan: [
      "Prescribed Metoprolol 25mg twice daily for anxiety-related symptoms",
      "Recommended stress management techniques including deep breathing exercises",
      "Dietary modifications: reduce caffeine intake",
      "Regular exercise routine: 30 minutes of walking 5 times per week",
    ],
    prescriptions: [
      {
        name: "Metoprolol 25mg",
        dosage: "Once Daily",
        frequency: "8:00am or first thing in the morning",
      },
    ],
    labResults: [
      { name: "Electrocardiogram (EKG)", status: "Normal", notes: "Normal sinus rhythm" },
      { name: "Chest X-Ray", status: "Normal", notes: "Clear lung fields, normal heart size" },
    ],
    followUpInstructions: `Follow-up appointment in 4 weeks if symptoms persist or worsen. Immediate consultation recommended if chest pain becomes severe or is accompanied by shortness of breath.`,
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Coming soon",
      description: "PDF download will be available soon.",
    });
  };

  const handleShareSummary = () => {
    toast({
      title: "Coming soon",
      description: "Share functionality will be available soon.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/patient/specialists")}
              data-testid="button-back"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground" data-testid="heading-visit-summary">
              Visit Summary
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownloadPDF}
              data-testid="button-download-header"
            >
              <Download className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShareSummary}
              data-testid="button-share-header"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-6 pb-24">
        {/* Doctor Card */}
        <Card className="p-4" data-testid="card-doctor-info">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12" data-testid="avatar-doctor">
              <AvatarFallback className="bg-healthcare-prescription text-healthcare-prescription-foreground">
                {visitData.doctorInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div>
                <h2 className="font-semibold text-foreground" data-testid="text-doctor-name">
                  {visitData.doctorName}
                </h2>
                <p className="text-sm text-muted-foreground" data-testid="text-doctor-specialty">
                  {visitData.specialty}
                </p>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground" data-testid="text-visit-date">
                    {visitData.date}
                  </span>
                  <span className="text-sm text-muted-foreground" data-testid="text-visit-year">
                    {visitData.year}
                  </span>
                </div>
                <StatusBadge variant="success" data-testid="badge-visit-status">
                  {visitData.status}
                </StatusBadge>
              </div>
              <p className="text-sm text-muted-foreground" data-testid="text-visit-duration">
                Duration: {visitData.duration}
              </p>
            </div>
          </div>
        </Card>

        {/* Chief Complaint */}
        <Card className="p-4 space-y-3" data-testid="card-chief-complaint">
          <h3 className="font-semibold text-foreground" data-testid="heading-chief-complaint">
            Chief Complaint
          </h3>
          <p className="text-sm text-foreground" data-testid="text-chief-complaint">
            {visitData.chiefComplaint}
          </p>
        </Card>

        {/* Clinical Assessment */}
        <Card className="p-4 space-y-3" data-testid="card-clinical-assessment">
          <h3 className="font-semibold text-foreground" data-testid="heading-clinical-assessment">
            Clinical Assessment
          </h3>
          <p className="text-sm text-foreground leading-relaxed" data-testid="text-clinical-assessment">
            {visitData.clinicalAssessment}
          </p>
        </Card>

        {/* Diagnosis */}
        <Card className="p-4 space-y-3" data-testid="card-diagnosis">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-healthcare-prescription/10 flex items-center justify-center">
              <Pill className="h-4 w-4 text-healthcare-prescription" />
            </div>
            <h3 className="font-semibold text-foreground" data-testid="heading-diagnosis">
              Diagnosis
            </h3>
          </div>
          <p className="text-sm text-foreground" data-testid="text-diagnosis">
            {visitData.diagnosis}
          </p>
        </Card>

        {/* Vital Signs */}
        <Card className="p-4 space-y-4" data-testid="card-vital-signs">
          <h3 className="font-semibold text-foreground" data-testid="heading-vital-signs">
            Vital Signs
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {visitData.vitalSigns.map((vital, index) => (
              <div key={index} className="space-y-1" data-testid={`vital-${index}`}>
                <div className="flex items-center gap-2">
                  <vital.icon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground" data-testid={`vital-label-${index}`}>
                    {vital.label}
                  </p>
                </div>
                <p className="text-sm font-medium text-foreground" data-testid={`vital-value-${index}`}>
                  {vital.value}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Treatment Plan */}
        <Card className="p-4 space-y-3" data-testid="card-treatment-plan">
          <h3 className="font-semibold text-foreground" data-testid="heading-treatment-plan">
            Treatment Plan
          </h3>
          <ul className="space-y-2 list-disc list-inside">
            {visitData.treatmentPlan.map((item, index) => (
              <li key={index} className="text-sm text-foreground" data-testid={`treatment-item-${index}`}>
                {item}
              </li>
            ))}
          </ul>
        </Card>

        {/* Prescriptions */}
        <Card className="p-4" data-testid="card-prescriptions">
          <Collapsible open={isPrescriptionOpen} onOpenChange={setIsPrescriptionOpen}>
            <CollapsibleTrigger className="w-full" data-testid="trigger-prescriptions">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-healthcare-prescription" />
                  <h3 className="font-semibold text-foreground" data-testid="heading-prescriptions">
                    Prescriptions
                  </h3>
                </div>
                <ChevronLeft className={`h-5 w-5 text-muted-foreground transition-transform ${isPrescriptionOpen ? '-rotate-90' : 'rotate-180'}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-3">
              {visitData.prescriptions.map((prescription, index) => (
                <div key={index} className="space-y-2 border-t border-border pt-3" data-testid={`prescription-${index}`}>
                  <p className="font-medium text-foreground" data-testid={`prescription-name-${index}`}>
                    {prescription.name}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Frequency</p>
                      <p className="text-foreground" data-testid={`prescription-dosage-${index}`}>
                        {prescription.dosage}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time</p>
                      <p className="text-foreground" data-testid={`prescription-frequency-${index}`}>
                        {prescription.frequency}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Lab Results & Tests */}
        <Card className="p-4 space-y-4" data-testid="card-lab-results">
          <h3 className="font-semibold text-foreground" data-testid="heading-lab-results">
            Lab Results & Tests
          </h3>
          <div className="space-y-3">
            {visitData.labResults.map((result, index) => (
              <div key={index} className="space-y-2" data-testid={`lab-result-${index}`}>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground" data-testid={`lab-result-name-${index}`}>
                    {result.name}
                  </p>
                  <StatusBadge variant="success" data-testid={`lab-result-status-${index}`}>
                    {result.status}
                  </StatusBadge>
                </div>
                <p className="text-sm text-muted-foreground" data-testid={`lab-result-notes-${index}`}>
                  {result.notes}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Follow-up Instructions */}
        <Card className="p-4 space-y-3" data-testid="card-follow-up">
          <h3 className="font-semibold text-foreground" data-testid="heading-follow-up">
            Follow-up Instructions
          </h3>
          <p className="text-sm text-foreground" data-testid="text-follow-up">
            {visitData.followUpInstructions}
          </p>
        </Card>
      </main>

      {/* Bottom Actions - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-4">
        <div className="container mx-auto max-w-2xl flex gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleDownloadPDF}
            data-testid="button-download-pdf"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleShareSummary}
            data-testid="button-share-summary"
          >
            <Share2 className="h-4 w-4" />
            Share Summary
          </Button>
        </div>
      </div>
    </div>
  );
}

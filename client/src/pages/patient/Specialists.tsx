import { useState } from "react";
import { useLocation } from "wouter";
import { PatientShell } from "@/components/PatientShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Info, ChevronRight, Calendar, MessageCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PastVisit {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  status: "completed" | "cancelled";
}

interface UpcomingAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'online' | 'local' | 'both';
}

export default function Specialists() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Mock data for upcoming appointment
  const upcomingAppointment: UpcomingAppointment | null = {
    id: "upcoming-1",
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: "Dec 15",
    time: "2:30 PM",
    type: 'both',
  };

  // Mock data for past visits
  const pastVisits: PastVisit[] = [
    {
      id: "1",
      doctorName: "Dr. Michael Chen",
      specialty: "Cardiologist",
      date: "Nov 2024",
      status: "completed",
    },
    {
      id: "2",
      doctorName: "Dr. Angela Rodriguez",
      specialty: "Dermatologist",
      date: "Oct 15, 2024",
      status: "completed",
    },
    {
      id: "3",
      doctorName: "Dr. James Wilson",
      specialty: "Orthopedist",
      date: "Sep 22, 2024",
      status: "completed",
    },
    {
      id: "4",
      doctorName: "Dr. Lisa Thompson",
      specialty: "Endocrinologist",
      date: "Aug 10, 2024",
      status: "cancelled",
    },
  ];

  const handleViewSummary = (visitId: string) => {
    setLocation(`/patient/visits/${visitId}`);
  };

  const handleCancelAppointment = () => {
    toast({
      title: "Appointment cancelled",
      description: "Your appointment has been cancelled successfully.",
      variant: "destructive",
    });
    setShowCancelModal(false);
  };

  const handleJoinWhatsApp = () => {
    toast({
      title: "Opening WhatsApp",
      description: "Redirecting to WhatsApp consultation...",
    });
  };

  const handleRequestNewTime = () => {
    toast({
      title: "Coming soon",
      description: "Request new time feature will be available soon.",
    });
  };

  return (
    <PatientShell>
      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        {/* Info Banner */}
        <Alert className="bg-info/10 border-info" data-testid="info-banner">
          <Info className="h-5 w-5 text-info" />
          <AlertDescription className="ml-2 text-sm text-foreground">
            You cannot schedule specialist appointments directly. First connect with a 
            general practitioner to assess your situation and a specialist will be assigned 
            to you based on your requirements. Click the button below to start a GP consult session.
          </AlertDescription>
        </Alert>

        {/* Start GP Consult Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={() => setLocation("/patient/intake")}
          data-testid="button-start-gp-consult"
        >
          Start GP Consult
        </Button>

        {/* Upcoming Appointments Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground" data-testid="heading-upcoming-appointments">
            Upcoming Appointments
          </h2>

          {upcomingAppointment ? (
            <Card className="p-4 hover-elevate" data-testid="card-upcoming-appointment">
              <div className="space-y-4">
                {/* Doctor Info */}
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground" data-testid="text-upcoming-doctor-name">
                    {upcomingAppointment.doctorName}
                  </h3>
                  <p className="text-sm text-muted-foreground" data-testid="text-upcoming-specialty">
                    {upcomingAppointment.specialty}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="text-upcoming-datetime">
                    <Calendar className="h-4 w-4" />
                    <span>{upcomingAppointment.date} at {upcomingAppointment.time}</span>
                  </div>
                </div>

                {/* Appointment Type Badges */}
                <div className="flex gap-2">
                  {(upcomingAppointment.type === 'online' || upcomingAppointment.type === 'both') && (
                    <StatusBadge variant="info" className="px-2 py-0.5" data-testid="badge-online-video">
                      Online video
                    </StatusBadge>
                  )}
                  {(upcomingAppointment.type === 'local' || upcomingAppointment.type === 'both') && (
                    <StatusBadge variant="default" className="px-2 py-0.5" data-testid="badge-local">
                      Local
                    </StatusBadge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    className="w-full gap-2"
                    onClick={handleJoinWhatsApp}
                    data-testid="button-join-whatsapp"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Join via WhatsApp
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={handleRequestNewTime}
                      data-testid="button-request-new-time"
                    >
                      <Clock className="h-4 w-4" />
                      Request new time
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-destructive hover:text-destructive"
                      onClick={() => setShowCancelModal(true)}
                      data-testid="button-cancel-appointment"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground" data-testid="text-no-upcoming">
              No upcoming appointments
            </p>
          )}
        </div>

        {/* Past Visits Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground" data-testid="heading-past-visits">
            Past Visits
          </h2>

          <div className="space-y-3">
            {pastVisits.map((visit) => (
              <Card
                key={visit.id}
                className="p-4 hover-elevate active-elevate-2"
                data-testid={`card-visit-${visit.id}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-semibold text-foreground" data-testid={`text-doctor-${visit.id}`}>
                        {visit.doctorName}
                      </h3>
                      <p className="text-sm text-muted-foreground" data-testid={`text-specialty-${visit.id}`}>
                        {visit.specialty}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-date-${visit.id}`}>
                        {visit.date}
                      </p>
                    </div>
                    <StatusBadge
                      variant={visit.status === "completed" ? "success" : "error"}
                      data-testid={`badge-status-${visit.id}`}
                    >
                      {visit.status === "completed" ? "Completed" : "Cancelled"}
                    </StatusBadge>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewSummary(visit.id)}
                    className="gap-2"
                    data-testid={`button-view-summary-${visit.id}`}
                  >
                    View summary
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Cancel Appointment Modal */}
      <AlertDialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <AlertDialogContent data-testid="modal-cancel-appointment">
          <AlertDialogHeader>
            <AlertDialogTitle data-testid="modal-title">
              Cancel Appointment
            </AlertDialogTitle>
            <AlertDialogDescription data-testid="modal-description">
              Are you sure you want to cancel your appointment with Dr. Sarah Johnson? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction
              onClick={handleCancelAppointment}
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-cancel"
            >
              Cancel Appointment
            </AlertDialogAction>
            <AlertDialogCancel
              className="w-full mt-0"
              data-testid="button-keep-appointment"
            >
              Keep Appointment
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PatientShell>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PatientShell } from "@/components/PatientShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressDots } from "@/components/ui/progress-dots";
import { ActionButton } from "@/components/ui/action-button";
import { ObjectUploader } from "@/components/ObjectUploader";
import { RequestSamplePickupModal } from "@/components/RequestSamplePickupModal";
import { 
  MapPin, 
  Calendar, 
  Navigation, 
  Truck, 
  Download, 
  Clock,
  Upload,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, type EnrichedDiagnosticsOrder } from "@/lib/api";
import { getUserFromStorage } from "@/lib/storage";
import { format } from "date-fns";

function getStatusBadgeVariant(status: EnrichedDiagnosticsOrder["status"]) {
  switch (status) {
    case "completed":
      return "success";
    case "sample_collected":
      return "info";
    case "in_progress":
      return "warning";
    case "ordered":
    default:
      return "default";
  }
}

function getStatusLabel(status: EnrichedDiagnosticsOrder["status"]) {
  switch (status) {
    case "completed":
      return "Results ready";
    case "sample_collected":
      return "Sample collected";
    case "in_progress":
      return "In progress";
    case "ordered":
      return "Awaiting sample";
    default:
      return status;
  }
}

function getProgressFromStatus(status: EnrichedDiagnosticsOrder["status"]): { current: number; total: number } {
  const total = 4;
  switch (status) {
    case "ordered":
      return { current: 0, total };
    case "sample_collected":
      return { current: 1, total };
    case "in_progress":
      return { current: 2, total };
    case "completed":
      return { current: 3, total };
    default:
      return { current: 0, total };
  }
}

function formatAppointmentDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, "yyyy-MM-dd 'at' HH:mm");
}

export default function Diagnostics() {
  const { toast } = useToast();
  const [pickupModalOpen, setPickupModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>();

  const userData = getUserFromStorage() || {};
  const userId = userData.id;
  const role = userData.role;

  const { data: orders = [], isLoading } = useQuery<EnrichedDiagnosticsOrder[]>({
    queryKey: ["/api/diagnostics/orders", userId, role],
    queryFn: () => api.diagnostics.listOrders(userId, role),
    enabled: !!userId && !!role
  });

  const handleGetDirections = (order: EnrichedDiagnosticsOrder) => {
    toast({
      title: "Opening directions",
      description: `Getting directions to ${order.labInfo?.name || "the lab"}`,
    });
  };

  const handleBookPickup = (order: EnrichedDiagnosticsOrder) => {
    setSelectedOrderId(order.id);
    setPickupModalOpen(true);
  };

  const handleDownloadResults = (order: EnrichedDiagnosticsOrder) => {
    toast({
      title: "Downloading results",
      description: `Lab results for ${order.testType} downloaded`,
    });
  };

  const handleChangeSlot = (order: EnrichedDiagnosticsOrder) => {
    toast({
      title: "Change appointment",
      description: `Opening appointment scheduler for ${order.testType}`,
    });
  };

  const handleGetUploadParameters = async () => {
    const uploadId = `diagnostic-upload-${Date.now()}`;
    const response = await fetch(`/api/object-storage/upload-url?path=.private/${uploadId}.pdf`);
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = (result: any) => {
    toast({
      title: "Upload complete",
      description: "Your diagnostic results have been uploaded successfully",
    });
  };

  if (isLoading) {
    return (
      <PatientShell>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PatientShell>
    );
  }

  return (
    <PatientShell>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Info Banner */}
        <div className="flex items-center gap-3 mb-6" data-testid="info-banner">
          <p className="text-sm text-muted-foreground">
            Track orders and upload outside results
          </p>
          <Badge variant="secondary" data-testid="badge-minimal-pii">
            Minimal PII
          </Badge>
        </div>

        {/* Test Order Cards */}
        {orders && orders.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No diagnostic orders found</p>
          </Card>
        ) : null}
        
        {orders && orders.length > 0 && (
          <div className="space-y-6 mb-8">
            {orders.map((order: EnrichedDiagnosticsOrder) => {
              const progress = getProgressFromStatus(order.status);
              const statusVariant = getStatusBadgeVariant(order.status);
              const statusLabel = getStatusLabel(order.status);
              const showDownload = order.status === "completed" && order.resultUrl;

              return (
                <Card
                  key={order.id}
                  className="p-4 hover-elevate"
                  data-testid={`card-order-${order.id}`}
                >
                  {/* Header Row: Progress Dots and Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <ProgressDots
                      total={progress.total}
                      current={progress.current}
                    />
                    <StatusBadge variant={statusVariant}>
                      {statusLabel}
                    </StatusBadge>
                  </div>

                  {/* Test Name */}
                  <h3 
                    className="text-lg font-semibold text-foreground mb-3"
                    data-testid={`text-test-name-${order.id}`}
                  >
                    {order.testType}
                  </h3>

                  {/* Lab Location */}
                  {order.labInfo && (
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p 
                        className="text-sm text-muted-foreground"
                        data-testid={`text-location-${order.id}`}
                      >
                        {order.labInfo.name}, {order.labInfo.location}
                      </p>
                    </div>
                  )}

                  {/* Date/Time */}
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <p 
                      className="text-sm text-muted-foreground"
                      data-testid={`text-date-${order.id}`}
                    >
                      {formatAppointmentDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <ActionButton
                      icon={<Navigation className="h-4 w-4" />}
                      label="Get directions"
                      onClick={() => handleGetDirections(order)}
                    />
                    <ActionButton
                      icon={<Truck className="h-4 w-4" />}
                      label="Book sample pickup"
                      onClick={() => handleBookPickup(order)}
                    />
                    {showDownload && (
                      <ActionButton
                        icon={<Download className="h-4 w-4" />}
                        label="Download Results"
                        onClick={() => handleDownloadResults(order)}
                      />
                    )}
                  </div>

                  {/* Secondary Action: Change Slot */}
                  {!showDownload && (
                    <button
                      onClick={() => handleChangeSlot(order)}
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                      data-testid={`button-change-slot-${order.id}`}
                    >
                      <Clock className="h-4 w-4" />
                      <span>Change slot</span>
                    </button>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* File Upload Section */}
        <div className="space-y-4" data-testid="upload-section">
          <p className="text-sm text-muted-foreground">
            Attach PDF or image. Max 10MB each. Make sure your name and date are visible
          </p>
          <ObjectUploader
            maxNumberOfFiles={5}
            maxFileSize={10485760}
            onGetUploadParameters={handleGetUploadParameters}
            onComplete={handleUploadComplete}
            buttonClassName="w-full sm:w-auto"
          >
            <Upload className="h-4 w-4 mr-2" />
            Attach file
          </ObjectUploader>
        </div>
      </div>

      {/* Request Sample Pickup Modal */}
      <RequestSamplePickupModal
        open={pickupModalOpen}
        onOpenChange={setPickupModalOpen}
        orderId={selectedOrderId}
      />
    </PatientShell>
  );
}

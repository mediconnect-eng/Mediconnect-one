import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { PatientShell } from "@/components/PatientShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Check,
  ChevronRight,
  Loader2,
  MoreVertical,
  LocateFixed,
  Filter
} from "lucide-react";
import { api } from "@/lib/api";
import { getUserFromStorage } from "@/lib/storage";

// Mock pharmacy data for MVP
const mockPharmacies = [
  {
    id: "1",
    name: "CityMed Pharmacy",
    address: "456 Moi Ave, Nairobi",
    distance: "0.5 km"
  },
  {
    id: "2",
    name: "WellCare Pharmacy",
    address: "789 Uhuru Highway, Nairobi",
    distance: "0.8 km"
  },
  {
    id: "3",
    name: "HealthFirst Pharmacy",
    address: "123 Kenyatta Ave, Nairobi",
    distance: "1.2 km"
  }
];

export default function Pharmacy() {
  const [, setLocation] = useLocation();
  const [prescriptionTab, setPrescriptionTab] = useState<"active" | "all">("active");
  const [showLocationBanner, setShowLocationBanner] = useState(true);

  const userData = getUserFromStorage() || {};
  const patientId = userData.id;

  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: ["/api/prescriptions", patientId],
    queryFn: () => api.prescriptions.list(patientId),
    enabled: !!patientId
  });

  // Find the first active prescription
  const activePrescription = prescriptions.find(
    (p) => p.status === "active"
  );

  // Filter prescriptions based on tab
  const filteredPrescriptions =
    prescriptionTab === "active"
      ? prescriptions.filter((p) => p.status === "active")
      : prescriptions;

  // Map prescription status to badge variant and text
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active":
        return { variant: "success" as const, text: "Ready for collection", icon: <Check className="h-3 w-3 mr-1" /> };
      case "dispensed":
        return { variant: "info" as const, text: "Dispensed", icon: null };
      case "expired":
        return { variant: "error" as const, text: "Expired", icon: null };
      default:
        return { variant: "default" as const, text: status, icon: null };
    }
  };

  return (
    <PatientShell>
      <div className="flex flex-col min-h-full bg-background">
        {/* Location Permission Banner */}
        {showLocationBanner && (
          <Alert className="mx-4 mt-4 bg-info/10 border-info" data-testid="banner-location">
            <AlertDescription className="flex items-center justify-between">
              <span className="text-info-foreground text-sm">
                Allow location to find nearby verified pharmacies
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLocationBanner(false)}
                className="h-6 w-6 p-0"
                data-testid="button-close-banner"
              >
                ✕
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Active Prescription Card */}
        {activePrescription && (
          <div className="px-4 mt-4">
            <Card className="p-4 relative" data-testid="card-active-prescription">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-foreground">Active Prescription</h2>
                <StatusBadge variant="success" className="flex items-center">
                  <Check className="h-3 w-3 mr-1" />
                  Ready for collection
                </StatusBadge>
              </div>

              <p className="text-sm text-muted-foreground mb-4" data-testid="text-prescription-info">
                {activePrescription.id} • {activePrescription.createdAt ? new Date(activePrescription.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
              </p>

              {/* Medications List */}
              <Card className="bg-muted/30 p-3 mb-4 space-y-3" data-testid="card-medications">
                {(activePrescription.items as any[]).map((item, idx) => (
                  <div key={idx} className="space-y-1" data-testid={`medication-item-${idx}`}>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.instructions || `${item.frequency}${item.duration ? ` for ${item.duration}` : ''}`}
                    </p>
                  </div>
                ))}
              </Card>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => setLocation(`/patient/prescriptions/${activePrescription.id}`)}
                  data-testid="button-pick-pharmacy"
                >
                  Pick from Verified Pharmacy
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  data-testid="button-home-delivery"
                >
                  Order Home Delivery
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                data-testid="button-more-options"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </Card>
          </div>
        )}

        {/* Map Section - Placeholder for MVP */}
        <div className="px-4 mt-6">
          <Card className="p-8 text-center bg-muted/20" data-testid="section-map">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">Map showing nearby pharmacies</p>

            {/* Filter Buttons */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" data-testid="button-recenter">
                <LocateFixed className="h-3 w-3 mr-1" />
                Recenter
              </Button>
              <Button variant="outline" size="sm" data-testid="button-top-3">
                <Filter className="h-3 w-3 mr-1" />
                Top 3
              </Button>
              <Button variant="outline" size="sm" data-testid="button-all">
                All
              </Button>
            </div>
          </Card>
        </div>

        {/* Nearby Pharmacies List */}
        <div className="px-4 mt-6">
          <h3 className="text-base font-semibold text-foreground mb-3" data-testid="heading-nearby-pharmacies">
            Nearby Pharmacies
          </h3>
          <div className="space-y-2">
            {mockPharmacies.map((pharmacy) => (
              <Card
                key={pharmacy.id}
                className="p-4 hover-elevate active-elevate-2 cursor-pointer"
                onClick={() => {
                  // Navigate to pharmacy details (placeholder for now)
                }}
                data-testid={`card-pharmacy-${pharmacy.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground" data-testid={`text-pharmacy-name-${pharmacy.id}`}>
                      {pharmacy.name}
                    </h4>
                    <p className="text-sm text-muted-foreground" data-testid={`text-pharmacy-address-${pharmacy.id}`}>
                      {pharmacy.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground" data-testid={`text-pharmacy-distance-${pharmacy.id}`}>
                      {pharmacy.distance}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* All Prescriptions Section */}
        <div className="px-4 mt-6 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-foreground" data-testid="heading-all-prescriptions">
              All Prescriptions
            </h3>
            <Tabs value={prescriptionTab} onValueChange={(v) => setPrescriptionTab(v as "active" | "all")}>
              <TabsList data-testid="tabs-prescriptions">
                <TabsTrigger value="active" data-testid="tab-active">
                  Active
                </TabsTrigger>
                <TabsTrigger value="all" data-testid="tab-all">
                  All
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredPrescriptions.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No prescriptions found</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredPrescriptions.map((prescription) => {
                const statusInfo = getStatusInfo(prescription.status);
                return (
                  <Card
                    key={prescription.id}
                    className="p-4 hover-elevate active-elevate-2 cursor-pointer"
                    onClick={() => setLocation(`/patient/prescriptions/${prescription.id}`)}
                    data-testid={`card-prescription-${prescription.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <StatusBadge variant={statusInfo.variant} className="flex items-center w-fit">
                          {statusInfo.icon}
                          {statusInfo.text}
                        </StatusBadge>
                        <div>
                          <p className="text-sm font-medium text-foreground" data-testid={`text-prescription-date-${prescription.id}`}>
                            {prescription.createdAt ? new Date(prescription.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                          </p>
                          <p className="text-xs text-muted-foreground" data-testid={`text-prescription-id-${prescription.id}`}>
                            {prescription.id}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PatientShell>
  );
}

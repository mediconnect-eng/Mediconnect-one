import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/StatusChip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Microscope, 
  LogOut,
  Upload,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { getUserFromStorage } from "@/lib/storage";

export default function DiagnosticsOrders() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const userData = getUserFromStorage() || {};
  const userId = userData.id;
  const role = userData.role;

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["/api/diagnostics/orders", userId, role],
    queryFn: () => api.diagnostics.listOrders(userId, role),
    enabled: !!userId && !!role
  });

  const uploadMutation = useMutation({
    mutationFn: ({ orderId, fileData }: { orderId: string; fileData: any }) => 
      api.diagnostics.uploadResult(orderId, fileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diagnostics/orders", userId, role] });
      toast({
        title: "Results Uploaded",
        description: "Lab results have been successfully uploaded",
      });
      setUploadingFor(null);
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("mediconnect_user");
    setLocation("/");
  };

  const handleFileUpload = (orderId: string) => {
    setUploadingFor(orderId);
  };

  const handleUploadComplete = (orderId: string) => {
    uploadMutation.mutate({ orderId, fileData: "mock-file-data" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Diagnostics Portal</h1>
              <p className="text-sm text-muted-foreground">HealthLab Diagnostics</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Diagnostics Portal</h1>
              <p className="text-sm text-muted-foreground">HealthLab Diagnostics</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <Card className="p-12 text-center">
            <p className="text-destructive">Error loading orders: {error.message}</p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Diagnostics Portal</h1>
            <p className="text-sm text-muted-foreground">HealthLab Diagnostics</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Lab Orders</h2>
          <span className="text-sm text-muted-foreground">{orders.length} total orders</span>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6" data-testid={`order-${order.id}`}>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-healthcare-diagnostics/10 flex items-center justify-center flex-shrink-0">
                      <Microscope className="h-5 w-5 text-healthcare-diagnostics" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{order.testType}</h3>
                        <StatusChip status={order.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Order ID: <span className="font-mono">{order.orderId}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Test Type</p>
                    <p className="font-medium text-foreground">{order.testType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Order Date</p>
                    <p className="font-medium text-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {uploadingFor === order.id ? (
                  <div className="pt-4 border-t border-border space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`file-${order.id}`}>Upload Results</Label>
                      <Input
                        id={`file-${order.id}`}
                        type="file"
                        data-testid={`input-upload-${order.id}`}
                        className="cursor-pointer"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUploadComplete(order.id)}
                        data-testid={`button-upload-confirm-${order.id}`}
                        disabled={uploadMutation.isPending}
                      >
                        {uploadMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Upload
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setUploadingFor(null)}
                        data-testid={`button-upload-cancel-${order.id}`}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-border">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFileUpload(order.id)}
                      data-testid={`button-upload-${order.id}`}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Results
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Privacy Note:</strong> This portal displays minimal patient information to maintain privacy. 
            Order IDs are used for tracking without exposing personal details.
          </p>
        </div>
      </main>
    </div>
  );
}

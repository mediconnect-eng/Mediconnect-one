import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/StatusChip";
import { 
  Microscope, 
  LogOut,
  Upload,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { getUserFromStorage } from "@/lib/storage";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";

export default function DiagnosticsOrders() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const userData = getUserFromStorage();
  if (!userData?.id) {
    toast({ title: "Error", description: "User not logged in", variant: "destructive" });
    setLocation("/");
    return null;
  }

  const userId = userData.id;
  const role = userData.role;

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["/api/diagnostics/orders", userId, role],
    queryFn: () => api.diagnostics.listOrders(userId, role),
    enabled: !!userId && !!role
  });

  const uploadMutation = useMutation({
    mutationFn: ({ orderId, uploadURL }: { orderId: string; uploadURL: string }) => {
      return apiRequest("PUT", `/api/diagnostics/orders/${orderId}/upload`, { uploadURL, userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diagnostics/orders", userId, role] });
      toast({
        title: "Results Uploaded",
        description: "Lab results have been successfully uploaded",
      });
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

  const handleGetUploadParameters = async () => {
    const response = await apiRequest("POST", "/api/objects/upload", {});
    return {
      method: "PUT" as const,
      url: response.uploadURL,
    };
  };

  const handleUploadComplete = (orderId: string) => (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadURL = result.successful[0].uploadURL;
      if (uploadURL) {
        uploadMutation.mutate({ orderId, uploadURL });
      }
    }
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
                        Order ID: <span className="font-mono">{order.id}</span>
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
                    <p className="font-medium text-foreground">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <ObjectUploader
                    maxNumberOfFiles={1}
                    maxFileSize={52428800}
                    onGetUploadParameters={handleGetUploadParameters}
                    onComplete={handleUploadComplete(order.id)}
                    buttonClassName="h-9"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Results
                  </ObjectUploader>
                </div>
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

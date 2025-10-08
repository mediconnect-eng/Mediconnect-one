import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/StatusChip";
import { TabNav, type Tab } from "@/components/TabNav";
import { ArrowLeft, Microscope, Download, Loader2, UserCog, Pill, Heart, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { getUserFromStorage } from "@/lib/storage";

export default function Diagnostics() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const userData = getUserFromStorage() || {};
  const userId = userData.id;
  const role = userData.role;

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["/api/diagnostics/orders", userId, role],
    queryFn: () => api.diagnostics.listOrders(userId, role),
    enabled: !!userId && !!role
  });

  const tabs: Tab[] = [
    { id: "specialists", label: "Specialists", href: "/patient/home", icon: <UserCog className="h-5 w-5" /> },
    { id: "pharmacy", label: "Pharmacy", href: "/patient/home", icon: <Pill className="h-5 w-5" /> },
    { id: "care", label: "Care", href: "/patient/home", icon: <Heart className="h-5 w-5" /> },
    { id: "diagnostics", label: "Diagnostics", href: "/patient/diagnostics", icon: <Microscope className="h-5 w-5" /> },
    { id: "profile", label: "Profile", href: "/patient/profile", icon: <User className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("mediconnect_user");
    setLocation("/");
  };

  const handleDownloadResults = (orderId: string) => {
    toast({
      title: "Results Downloaded",
      description: `Lab results for ${orderId} have been downloaded`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Mediconnect</h1>
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

        <TabNav tabs={tabs} />

        <main className="container mx-auto px-4 py-8 max-w-5xl">
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
            <h1 className="text-2xl font-bold text-foreground">Mediconnect</h1>
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

        <TabNav tabs={tabs} />

        <main className="container mx-auto px-4 py-8 max-w-5xl">
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
          <h1 className="text-2xl font-bold text-foreground">Mediconnect</h1>
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

      <TabNav tabs={tabs} />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Microscope className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Lab Orders</h3>
            <p className="text-muted-foreground">You don't have any lab orders yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="p-6"
                data-testid={`lab-order-${order.id}`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-healthcare-diagnostics/10 flex items-center justify-center flex-shrink-0">
                        <Microscope className="h-5 w-5 text-healthcare-diagnostics" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
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

                  {order.resultUrl && (
                    <div className="pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadResults(order.id)}
                        data-testid={`button-download-${order.id}`}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Results
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

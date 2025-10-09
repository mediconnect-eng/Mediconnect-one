import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TabNav, type Tab } from "@/components/TabNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/StatusChip";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Inbox, 
  Activity, 
  History, 
  User,
  LogOut,
  MessageSquare,
  AlertCircle,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { api } from "@/lib/api";
import { getUserFromStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

const tabs: Tab[] = [
  { id: "requested", label: "Requested", href: "/specialist", icon: <Inbox className="h-5 w-5" /> },
  { id: "current", label: "Current", href: "/specialist", icon: <Activity className="h-5 w-5" /> },
  { id: "history", label: "History", href: "/specialist", icon: <History className="h-5 w-5" /> },
  { id: "profile", label: "Profile", href: "/specialist", icon: <User className="h-5 w-5" /> },
];

export default function SpecialistPortal() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const userData = getUserFromStorage() || {};
  const userId = userData.id;
  const role = userData.role;

  const { data: referrals = [], isLoading, error } = useQuery({
    queryKey: ["/api/referrals", userId, role],
    queryFn: () => api.referrals.list(userId, role),
    enabled: !!userId && !!role
  });

  const updateReferralMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "accepted" | "completed" }) =>
      api.referrals.updateStatus(id, status, userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/referrals"] });
      toast({
        title: variables.status === "accepted" ? "Referral accepted" : "Referral marked complete",
        description:
          variables.status === "accepted"
            ? "The care team has been notified you're taking this case."
            : "Thanks! The GP will see that you've wrapped up the referral.",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Unable to update referral",
        description: err?.message ?? "Please try again in a moment.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("mediconnect_user");
    setLocation("/");
  };

  const handleReferralStatus = (id: string, status: "accepted" | "completed") => {
    updateReferralMutation.mutate({ id, status });
  };

  const pendingCount = referrals.filter((referral) => referral.status !== "completed").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Specialist Portal</h1>
            <p className="text-sm text-muted-foreground">{userData.name ?? "Specialist"}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
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
        </div>
      </header>

      <TabNav tabs={tabs} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <Card className="p-12 text-center">
            <p className="text-destructive">Error loading referrals: {error.message}</p>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Referral Requests</h2>
              <span className="text-sm text-muted-foreground">
                {pendingCount} {pendingCount === 1 ? "open case" : "open cases"}
              </span>
            </div>

            {referrals.length === 0 ? (
              <Card className="p-12 text-center space-y-2">
                <h3 className="text-lg font-semibold text-foreground">No referrals yet</h3>
                <p className="text-muted-foreground text-sm">
                  When a GP refers a patient to you, the case will appear here instantly.
                </p>
              </Card>
            ) : (
              referrals.map((referral) => {
                const currentUpdate = updateReferralMutation.variables as
                  | { id?: string; status?: "accepted" | "completed" }
                  | undefined;
                const isUpdatingThis = updateReferralMutation.isPending && currentUpdate?.id === referral.id;
                const isAccepting = isUpdatingThis && currentUpdate?.status === "accepted";
                const isCompleting = isUpdatingThis && currentUpdate?.status === "completed";

                return (
                  <Card key={referral.id} className="p-6 hover-elevate" data-testid={`referral-${referral.id}`}>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-foreground">Referral {referral.id}</h3>
                            <StatusChip status={referral.status} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Referred: {referral.createdAt ? new Date(referral.createdAt).toLocaleString() : "N/A"}
                          </p>
                          <p className="text-sm text-foreground">{referral.reason}</p>
                          {referral.notes && <p className="text-sm text-muted-foreground italic">{referral.notes}</p>}
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          onClick={() => handleReferralStatus(referral.id, "accepted")}
                          disabled={referral.status !== "proposed" || isUpdatingThis}
                          data-testid={`button-accept-${referral.id}`}
                        >
                          {isAccepting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Accepting...
                            </>
                          ) : (
                            "Accept Referral"
                          )}
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-view-${referral.id}`}>
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleReferralStatus(referral.id, "completed")}
                          disabled={referral.status !== "accepted" || isUpdatingThis}
                          data-testid={`button-complete-${referral.id}`}
                        >
                          {isCompleting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Mark complete
                            </>
                          )}
                        </Button>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" disabled data-testid={`button-whatsapp-${referral.id}`}>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Join on WhatsApp
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              <p>WhatsApp integration coming soon</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
}

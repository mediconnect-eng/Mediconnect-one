import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { TabNav, type Tab } from "@/components/TabNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/StatusChip";
import { StaticChatThread } from "@/components/StaticChatThread";
import { 
  Inbox, 
  CheckCircle2, 
  MessageSquare, 
  History, 
  User,
  LogOut,
  Clock,
  Loader2
} from "lucide-react";
import { api } from "@/lib/api";

const tabs: Tab[] = [
  { id: "live", label: "Live Requests", href: "/gp", icon: <Inbox className="h-5 w-5" /> },
  { id: "completed", label: "Completed", href: "/gp", icon: <CheckCircle2 className="h-5 w-5" /> },
  { id: "chats", label: "Chats", href: "/gp", icon: <MessageSquare className="h-5 w-5" /> },
  { id: "history", label: "History", href: "/gp", icon: <History className="h-5 w-5" /> },
  { id: "profile", label: "Profile", href: "/gp", icon: <User className="h-5 w-5" /> },
];

const mockMessages = [
  {
    id: "msg-1",
    consultId: "C-001",
    senderId: "patient-1",
    content: "Hi doctor, I've been experiencing severe headaches",
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "msg-2",
    consultId: "C-001",
    senderId: "gp-1",
    content: "I understand. Can you describe when the headaches occur?",
    createdAt: new Date(Date.now() - 3000000).toISOString()
  }
];

export default function GPPortal() {
  const [, setLocation] = useLocation();

  const userData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("mediconnect_user") || "{}") : {};
  const userId = userData.id;
  const role = userData.role;

  const { data: consults = [], isLoading, error } = useQuery({
    queryKey: ["/api/consults", role, userId],
    queryFn: () => api.consults.listConsults(role, userId),
    enabled: !!userId && !!role
  });

  const handleLogout = () => {
    localStorage.removeItem("mediconnect_user");
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">GP Portal</h1>
            <p className="text-sm text-muted-foreground">Dr. Sarah Johnson</p>
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

      <TabNav tabs={tabs} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <Card className="p-12 text-center">
            <p className="text-destructive">Error loading consults: {error.message}</p>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Live Consultation Requests</h2>
                <span className="text-sm text-muted-foreground">{consults.length} pending</span>
              </div>

              {consults.map((consult) => (
              <Card key={consult.id} className="p-6 hover-elevate" data-testid={`consult-${consult.id}`}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">Patient Consult</h3>
                        <StatusChip status={consult.status} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Consult ID: <span className="font-mono">{consult.id}</span>
                      </p>
                      <p className="text-sm text-foreground">{consult.intakeSummary}</p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(consult.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" data-testid={`button-accept-${consult.id}`}>
                      Accept Consult
                    </Button>
                    <Button size="sm" variant="outline" data-testid={`button-view-${consult.id}`}>
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
              ))}
            </div>

            <div>
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Recent Chats (Read-Only)</h3>
                <StaticChatThread messages={mockMessages} currentUserId="gp-1" />
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

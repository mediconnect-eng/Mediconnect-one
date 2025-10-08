import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, Bell, Shield, FileText } from "lucide-react";

export default function Profile() {
  const [, setLocation] = useLocation();
  const [consents, setConsents] = useState({
    dataSharing: true,
    marketing: false,
    research: false
  });
  const [notifications, setNotifications] = useState({
    whatsapp: true,
    email: false,
    sms: true
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/patient/home")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your preferences and consents</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Patient Profile</h2>
                <p className="text-sm text-muted-foreground">Manage your health information</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium text-foreground">Test Patient</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">+1 (555) 123-4567</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-whatsapp" className="text-base">WhatsApp</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via WhatsApp</p>
                </div>
                <Switch
                  id="notif-whatsapp"
                  checked={notifications.whatsapp}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, whatsapp: checked })}
                  data-testid="switch-notif-whatsapp"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-email" className="text-base">Email</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  id="notif-email"
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  data-testid="switch-notif-email"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notif-sms" className="text-base">SMS</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                </div>
                <Switch
                  id="notif-sms"
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                  data-testid="switch-notif-sms"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Privacy & Consents</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="consent-sharing" className="text-base">Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">Share health data with care team</p>
                </div>
                <Switch
                  id="consent-sharing"
                  checked={consents.dataSharing}
                  onCheckedChange={(checked) => setConsents({ ...consents, dataSharing: checked })}
                  data-testid="switch-consent-sharing"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="consent-marketing" className="text-base">Marketing Communications</Label>
                  <p className="text-sm text-muted-foreground">Receive health tips and updates</p>
                </div>
                <Switch
                  id="consent-marketing"
                  checked={consents.marketing}
                  onCheckedChange={(checked) => setConsents({ ...consents, marketing: checked })}
                  data-testid="switch-consent-marketing"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="consent-research" className="text-base">Research Participation</Label>
                  <p className="text-sm text-muted-foreground">Use anonymized data for research</p>
                </div>
                <Switch
                  id="consent-research"
                  checked={consents.research}
                  onCheckedChange={(checked) => setConsents({ ...consents, research: checked })}
                  data-testid="switch-consent-research"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Legal Documents</h2>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setLocation("/legal/terms")}
                data-testid="button-terms"
              >
                <FileText className="mr-2 h-4 w-4" />
                Terms of Service
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setLocation("/legal/privacy")}
                data-testid="button-privacy"
              >
                <Shield className="mr-2 h-4 w-4" />
                Privacy Policy
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

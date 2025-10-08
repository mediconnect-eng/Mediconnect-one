import { useState } from "react";
import { PatientShell } from "@/components/PatientShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface NotificationSettings {
  whatsappAppointments: boolean;
  whatsappResults: boolean;
  whatsappPayments: boolean;
  inAppNotifications: boolean;
}

export default function NotificationPreferences() {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem("notification_preferences");
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      whatsappAppointments: true,
      whatsappResults: true,
      whatsappPayments: false,
      inAppNotifications: true,
    };
  });

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    localStorage.setItem("notification_preferences", JSON.stringify(settings));
    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated successfully.",
    });
  };

  const notificationOptions = [
    {
      key: "whatsappAppointments" as const,
      title: "WhatsApp: appointment updates",
      description: "Get reminders and updates about your appointments",
      testId: "toggle-whatsapp-appointments",
    },
    {
      key: "whatsappResults" as const,
      title: "WhatsApp: results and notes",
      description: "Receive lab results and doctor's notes via WhatsApp",
      testId: "toggle-whatsapp-results",
    },
    {
      key: "whatsappPayments" as const,
      title: "WhatsApp: payments and invoices",
      description: "Get payment reminders and invoice notifications",
      testId: "toggle-whatsapp-payments",
    },
    {
      key: "inAppNotifications" as const,
      title: "In-app notifications",
      description: "Show notifications within the Mediconnect app",
      testId: "toggle-in-app",
    },
  ];

  return (
    <PatientShell>
      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-4">
        {/* Notification Settings Card */}
        <Card data-testid="card-notification-settings">
          <CardContent className="p-4 space-y-4">
            {notificationOptions.map((option, index) => (
              <div key={option.key}>
                <div className="flex items-center justify-between gap-4 py-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground" data-testid={`text-${option.testId}`}>
                      {option.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1" data-testid={`desc-${option.testId}`}>
                      {option.description}
                    </p>
                  </div>
                  <Switch
                    checked={settings[option.key]}
                    onCheckedChange={() => handleToggle(option.key)}
                    data-testid={option.testId}
                  />
                </div>
                {index < notificationOptions.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Info Note */}
        <Card className="bg-muted/30" data-testid="card-info-note">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground" data-testid="text-info-note">
              SMS/Email are not supported in MVP.
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="pt-4 pb-8">
          <Button
            className="w-full"
            onClick={handleSave}
            data-testid="button-save"
          >
            Save
          </Button>
        </div>
      </div>
    </PatientShell>
  );
}

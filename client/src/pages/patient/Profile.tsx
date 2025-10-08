import { useState } from "react";
import { useLocation } from "wouter";
import { PatientShell } from "@/components/PatientShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Users, 
  CreditCard, 
  MapPin, 
  FileText, 
  Bell, 
  HelpCircle, 
  Scale,
  LogOut,
  ChevronRight,
  Headphones,
  AlertTriangle,
  Edit
} from "lucide-react";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("mediconnect_user");
    setLocation("/");
  };

  const handleComingSoon = (feature: string) => {
    toast({
      title: "Coming soon",
      description: `${feature} will be available in a future update.`,
    });
  };

  const menuItems = [
    {
      icon: Users,
      title: "Dependents and family",
      subtitle: "2 dependents",
      route: "/patient/profile/dependents",
      testId: "menu-dependents"
    },
    {
      icon: CreditCard,
      title: "Payments",
      subtitle: "Payment methods and invoices",
      route: "/patient/profile/payments",
      testId: "menu-payments"
    },
    {
      icon: MapPin,
      title: "Addresses",
      subtitle: "Delivery and consultation addresses",
      route: "/patient/profile/addresses",
      testId: "menu-addresses"
    },
    {
      icon: FileText,
      title: "Records and documents",
      subtitle: "Medical history and reports",
      route: "/patient/profile/records",
      testId: "menu-records"
    }
  ];

  const legalItems = [
    {
      title: "Terms of service",
      route: "/legal/terms",
      testId: "link-terms"
    },
    {
      title: "Privacy policy",
      route: "/legal/privacy",
      testId: "link-privacy"
    }
  ];

  return (
    <PatientShell>
      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-4">
        {/* User Info Card */}
        <Card data-testid="card-user-info">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-6">
              <Avatar className="h-14 w-14 bg-primary" data-testid="avatar-user">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-7 w-7" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground" data-testid="text-username">
                  John Smith
                </h2>
                <p className="text-sm text-muted-foreground" data-testid="text-user-role">
                  Account holder
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp number</p>
                  <p className="text-sm font-medium text-foreground" data-testid="text-whatsapp">
                    +254 700 123 456
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary"
                  onClick={() => handleComingSoon("Change WhatsApp number")}
                  data-testid="button-change-whatsapp"
                >
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Language</p>
                  <p className="text-sm font-medium text-foreground" data-testid="text-language">
                    English
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary"
                  onClick={() => handleComingSoon("Change language")}
                  data-testid="button-change-language"
                >
                  Change
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleComingSoon("Edit profile")}
              data-testid="button-edit-profile"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit profile
            </Button>
          </CardContent>
        </Card>

        {/* Menu Items */}
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.testId}
              className="hover-elevate active-elevate-2 cursor-pointer"
              onClick={() => handleComingSoon(item.title)}
              data-testid={item.testId}
            >
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex-shrink-0">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </CardContent>
            </Card>
          );
        })}

        {/* Notification Preferences */}
        <Card
          className="hover-elevate active-elevate-2 cursor-pointer"
          onClick={() => setLocation("/patient/profile/notifications")}
          data-testid="menu-notifications"
        >
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex-shrink-0">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Notification preferences</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card data-testid="card-support">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
              Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full"
              onClick={() => setLocation("/patient/support")}
              data-testid="button-contact-support"
            >
              <Headphones className="h-4 w-4 mr-2" />
              Contact support
            </Button>
            <Button
              variant="outline"
              className="w-full bg-amber-400 hover:bg-amber-500 text-amber-950 border-amber-500"
              onClick={() => handleComingSoon("Report an issue")}
              data-testid="button-report-issue"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report an issue
            </Button>
          </CardContent>
        </Card>

        {/* Legal Section */}
        <Card data-testid="card-legal">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Scale className="h-5 w-5 text-muted-foreground" />
              Legal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {legalItems.map((item) => (
              <div
                key={item.testId}
                className="flex items-center justify-between p-3 -mx-3 rounded-md hover-elevate active-elevate-2 cursor-pointer"
                onClick={() => setLocation(item.route)}
                data-testid={item.testId}
              >
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Version Info */}
        <p className="text-center text-sm text-muted-foreground py-2" data-testid="text-version">
          Version 1.0.0 (Build 123)
        </p>

        {/* Sign Out Button */}
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => setIsSignOutDialogOpen(true)}
          data-testid="button-sign-out"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>

        {/* Sign Out Confirmation Dialog */}
        <AlertDialog open={isSignOutDialogOpen} onOpenChange={setIsSignOutDialogOpen}>
          <AlertDialogContent data-testid="dialog-sign-out">
            <AlertDialogHeader className="text-center">
              <AlertDialogTitle className="text-center" data-testid="dialog-title-sign-out">
                Sign out?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center" data-testid="dialog-description-sign-out">
                You'll need WhatsApp to sign in again. Your data will remain safe and secure.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
              <AlertDialogAction
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={handleLogout}
                data-testid="button-confirm-sign-out"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </AlertDialogAction>
              <AlertDialogCancel
                className="w-full mt-0"
                data-testid="button-cancel-sign-out"
              >
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PatientShell>
  );
}

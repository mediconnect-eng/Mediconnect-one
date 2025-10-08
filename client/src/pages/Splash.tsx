import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { getUserFromStorage } from "@/lib/storage";

export default function Splash() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      const user = getUserFromStorage();
      
      if (user) {
        // Redirect to role-based portal
        const role = user.role || user.type;
        switch (role) {
          case "patient":
            setLocation("/patient");
            break;
          case "gp":
            setLocation("/gp");
            break;
          case "specialist":
            setLocation("/specialist");
            break;
          case "pharmacy":
            setLocation("/pharmacy/scanner");
            break;
          case "diagnostics":
            setLocation("/diagnostics/orders");
            break;
          default:
            setLocation("/");
        }
      } else {
        setLocation("/");
      }
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between p-8 animate-in fade-in duration-500">
      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        {/* Purple Circle with M */}
        <div 
          className="w-32 h-32 rounded-full bg-primary flex items-center justify-center shadow-lg"
          data-testid="logo-circle"
          style={{ boxShadow: "0px 8px 24px rgba(99, 102, 241, 0.3)" }}
        >
          <span 
            className="text-5xl font-bold text-primary-foreground"
            data-testid="logo-letter"
          >
            M
          </span>
        </div>

        {/* Brand Name */}
        <h1 
          className="text-3xl font-bold text-foreground"
          data-testid="text-brand-name"
        >
          Mediconnect
        </h1>

        {/* Tagline */}
        <p 
          className="text-base text-muted-foreground"
          data-testid="text-tagline"
        >
          Care that connects
        </p>

        {/* Loading Spinner */}
        <div className="mt-8 flex flex-col items-center space-y-3">
          <Loader2 
            className="h-8 w-8 text-primary animate-spin"
            data-testid="spinner-loading"
          />
          <p 
            className="text-sm text-muted-foreground"
            data-testid="text-loading-message"
          >
            Preparing your app
          </p>
        </div>
      </div>

      {/* Bottom Links */}
      <div className="flex items-center gap-4">
        <a
          href="/legal/terms"
          className="text-sm text-muted-foreground hover-elevate active-elevate-2 rounded-md px-2 py-1"
          data-testid="link-terms"
        >
          Terms
        </a>
        <span className="text-muted-foreground">•</span>
        <a
          href="/legal/privacy"
          className="text-sm text-muted-foreground hover-elevate active-elevate-2 rounded-md px-2 py-1"
          data-testid="link-privacy"
        >
          Privacy
        </a>
      </div>
    </div>
  );
}

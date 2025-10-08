import type { ReactNode } from "react"
import { useLocation, Link } from "wouter"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Phone, 
  Bell,
  UserCog, 
  Pill, 
  Heart, 
  Microscope, 
  User 
} from "lucide-react"

export interface PatientShellProps {
  children: ReactNode
  notificationCount?: number
  onEmergencyClick?: () => void
}

const tabs = [
  { id: "specialists", label: "Specialists", icon: UserCog, href: "/patient/specialists" },
  { id: "pharmacy", label: "Pharmacy", icon: Pill, href: "/patient/pharmacy" },
  { id: "care", label: "Care", icon: Heart, href: "/patient" },
  { id: "diagnostics", label: "Diagnostics", icon: Microscope, href: "/patient/diagnostics" },
  { id: "profile", label: "Profile", icon: User, href: "/patient/profile" },
]

export function PatientShell({ 
  children, 
  notificationCount = 0,
  onEmergencyClick 
}: PatientShellProps) {
  const [location] = useLocation()

  const handleEmergencyClick = () => {
    if (onEmergencyClick) {
      onEmergencyClick()
    } else {
      window.location.href = "tel:911"
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Bar */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <h1 className="text-xl font-bold text-foreground" data-testid="app-title">
          Mediconnect
        </h1>
        <div className="flex items-center gap-2">
          <button 
            className="relative"
            data-testid="button-notifications"
          >
            <Bell className="h-5 w-5 text-foreground" />
            {notificationCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                data-testid="notification-badge"
              >
                {notificationCount}
              </Badge>
            )}
          </button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleEmergencyClick}
            className="gap-1"
            data-testid="button-emergency"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Emergency</span>
          </Button>
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="h-16 border-t border-border bg-card">
        <div className="h-full flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = tab.href === "/patient" 
              ? location === "/patient"
              : location.startsWith(tab.href)
            
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors min-w-[60px]",
                  "hover-elevate active-elevate-2",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
                data-testid={`tab-${tab.id}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

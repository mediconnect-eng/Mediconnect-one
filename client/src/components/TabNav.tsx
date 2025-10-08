import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export interface Tab {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface TabNavProps {
  tabs: Tab[];
  className?: string;
}

export function TabNav({ tabs, className }: TabNavProps) {
  const [location] = useLocation();

  return (
    <div className={cn("border-b border-border bg-background", className)}>
      <nav className="flex overflow-x-auto scrollbar-hide" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = location === tab.href || location.startsWith(tab.href + '/');
          
          return (
            <Link key={tab.id} href={tab.href}>
              <a
                data-testid={`tab-${tab.id}`}
                className={cn(
                  "relative flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors hover-elevate",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {tab.icon && <span className="h-5 w-5">{tab.icon}</span>}
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

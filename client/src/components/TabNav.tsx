import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export interface Tab {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface TabNavProps {
  tabs: Tab[];
  className?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export function TabNav({ tabs, className, activeTab, onTabChange }: TabNavProps) {
  const [location] = useLocation();

  return (
    <div className={cn("border-b border-border bg-background", className)}>
      <nav className="flex overflow-x-auto scrollbar-hide" aria-label="Tabs">
        {tabs.map((tab) => {
          // Determine if tab is active based on tab type
          // State-based tabs (onClick): use activeTab prop
          // Route-based tabs (href): use location matching
          const isActive = tab.onClick 
            ? activeTab === tab.id 
            : tab.href && (location === tab.href || location.startsWith(tab.href + '/'));

          const content = (
            <>
              {tab.icon && <span className="h-5 w-5">{tab.icon}</span>}
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </>
          );

          const baseClassName = cn(
            "relative flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors hover-elevate cursor-pointer",
            isActive ? "text-primary" : "text-muted-foreground"
          );

          // If tab has onClick, render as button-like element
          if (tab.onClick) {
            return (
              <div
                key={tab.id}
                onClick={() => {
                  tab.onClick?.();
                  onTabChange?.(tab.id);
                }}
                data-testid={`tab-${tab.id}`}
                className={baseClassName}
              >
                {content}
              </div>
            );
          }

          // Otherwise render as Link
          return (
            <Link
              key={tab.id}
              href={tab.href || "#"}
              className={baseClassName}
              data-testid={`tab-${tab.id}`}
            >
              {content}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

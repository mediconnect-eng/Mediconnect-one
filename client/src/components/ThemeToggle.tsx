import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    if (theme === "light") {
      return <Sun className="h-5 w-5" />;
    } else if (theme === "dark") {
      return <Moon className="h-5 w-5" />;
    } else {
      return <Monitor className="h-5 w-5" />;
    }
  };

  const getAriaLabel = () => {
    if (theme === "light") {
      return "Switch to dark mode";
    } else if (theme === "dark") {
      return "Switch to system mode";
    } else {
      return "Switch to light mode";
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label={getAriaLabel()}
      data-testid="button-theme-toggle"
    >
      {getIcon()}
    </Button>
  );
}

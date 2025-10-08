import { useLocation } from "wouter";
import { RoleLogin } from "@/components/RoleLogin";

export default function DiagnosticsLogin() {
  const [, setLocation] = useLocation();

  const handleLogin = (identifier: string) => {
    localStorage.setItem("mediconnect_user", JSON.stringify({
      role: "diagnostics",
      identifier
    }));
    setLocation("/diagnostics/orders");
  };

  return <RoleLogin role="diagnostics" onLogin={handleLogin} />;
}

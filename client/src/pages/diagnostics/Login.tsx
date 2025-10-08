import { useLocation } from "wouter";
import { RoleLogin } from "@/components/RoleLogin";
import { api } from "@/lib/api";

export default function DiagnosticsLogin() {
  const [, setLocation] = useLocation();

  const handleLogin = async (identifier: string) => {
    const { user } = await api.auth.mockLogin(identifier, "diagnostics");
    localStorage.setItem("mediconnect_user", JSON.stringify(user));
    setLocation("/diagnostics/orders");
  };

  return <RoleLogin role="diagnostics" onLogin={handleLogin} />;
}

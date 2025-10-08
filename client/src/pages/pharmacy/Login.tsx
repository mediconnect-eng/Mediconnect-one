import { useLocation } from "wouter";
import { RoleLogin } from "@/components/RoleLogin";
import { api } from "@/lib/api";

export default function PharmacyLogin() {
  const [, setLocation] = useLocation();

  const handleLogin = async (identifier: string) => {
    const { user } = await api.auth.mockLogin(identifier, "pharmacy");
    localStorage.setItem("mediconnect_user", JSON.stringify(user));
    setLocation("/pharmacy/scanner");
  };

  return <RoleLogin role="pharmacy" onLogin={handleLogin} />;
}

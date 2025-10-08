import { useLocation } from "wouter";
import { RoleLogin } from "@/components/RoleLogin";
import { api } from "@/lib/api";

export default function SpecialistLogin() {
  const [, setLocation] = useLocation();

  const handleLogin = async (identifier: string) => {
    const { user } = await api.auth.mockLogin(identifier, "specialist");
    localStorage.setItem("mediconnect_user", JSON.stringify(user));
    setLocation("/specialist");
  };

  return <RoleLogin role="specialist" onLogin={handleLogin} />;
}

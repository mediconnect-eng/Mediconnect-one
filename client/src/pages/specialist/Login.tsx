import { useLocation } from "wouter";
import { RoleLogin } from "@/components/RoleLogin";
import { api } from "@/lib/api";

export default function SpecialistLogin() {
  const [, setLocation] = useLocation();

  const handleLogin = async (email: string, phone: string) => {
    const { user } = await api.auth.mockLogin(email, phone, "specialist");
    localStorage.setItem("mediconnect_user", JSON.stringify(user));
    setLocation("/specialist");
  };

  return <RoleLogin role="specialist" onLogin={handleLogin} />;
}

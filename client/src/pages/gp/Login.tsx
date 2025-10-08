import { useLocation } from "wouter";
import { RoleLogin } from "@/components/RoleLogin";
import { api } from "@/lib/api";

export default function GPLogin() {
  const [, setLocation] = useLocation();

  const handleLogin = async (email: string, phone: string) => {
    const { user } = await api.auth.mockLogin(email, phone, "gp");
    localStorage.setItem("mediconnect_user", JSON.stringify(user));
    setLocation("/gp");
  };

  return <RoleLogin role="gp" onLogin={handleLogin} />;
}

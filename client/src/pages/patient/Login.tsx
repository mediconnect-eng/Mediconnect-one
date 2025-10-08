import { useLocation } from "wouter";
import { RoleLogin } from "@/components/RoleLogin";
import { api } from "@/lib/api";

export default function PatientLogin() {
  const [, setLocation] = useLocation();

  const handleLogin = async (email: string, phone: string) => {
    const { user } = await api.auth.mockLogin(email, phone, "patient");
    localStorage.setItem("mediconnect_user", JSON.stringify(user));
    setLocation("/patient/home");
  };

  return <RoleLogin role="patient" onLogin={handleLogin} />;
}

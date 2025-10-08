import { useLocation } from "wouter";
import { RoleLogin } from "@/components/RoleLogin";

export default function PatientLogin() {
  const [, setLocation] = useLocation();

  const handleLogin = (identifier: string) => {
    localStorage.setItem("mediconnect_user", JSON.stringify({
      role: "patient",
      identifier
    }));
    setLocation("/patient/home");
  };

  return <RoleLogin role="patient" onLogin={handleLogin} />;
}

import { useLocation } from "wouter";
import { RoleLogin } from "@/components/RoleLogin";

export default function SpecialistLogin() {
  const [, setLocation] = useLocation();

  const handleLogin = (identifier: string) => {
    localStorage.setItem("mediconnect_user", JSON.stringify({
      role: "specialist",
      identifier
    }));
    setLocation("/specialist");
  };

  return <RoleLogin role="specialist" onLogin={handleLogin} />;
}

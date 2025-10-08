import { useLocation } from "wouter";
import { RoleLogin } from "@/components/RoleLogin";

export default function PharmacyLogin() {
  const [, setLocation] = useLocation();

  const handleLogin = (identifier: string) => {
    localStorage.setItem("mediconnect_user", JSON.stringify({
      role: "pharmacy",
      identifier
    }));
    setLocation("/pharmacy/scanner");
  };

  return <RoleLogin role="pharmacy" onLogin={handleLogin} />;
}

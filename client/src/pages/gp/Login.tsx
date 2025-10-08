import { useLocation } from "wouter";
import { RoleLogin } from "@/components/RoleLogin";

export default function GPLogin() {
  const [, setLocation] = useLocation();

  const handleLogin = (identifier: string) => {
    localStorage.setItem("mediconnect_user", JSON.stringify({
      role: "gp",
      identifier
    }));
    setLocation("/gp");
  };

  return <RoleLogin role="gp" onLogin={handleLogin} />;
}

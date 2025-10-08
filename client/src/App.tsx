import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";

import PatientLogin from "@/pages/patient/Login";
import PatientHome from "@/pages/patient/PatientHome";
import Intake from "@/pages/patient/Intake";
import ConsultWaiting from "@/pages/patient/ConsultWaiting";
import Prescriptions from "@/pages/patient/Prescriptions";
import PrescriptionDetail from "@/pages/patient/PrescriptionDetail";
import Diagnostics from "@/pages/patient/Diagnostics";
import Profile from "@/pages/patient/Profile";

import GPLogin from "@/pages/gp/Login";
import GPPortal from "@/pages/gp/GPPortal";

import SpecialistLogin from "@/pages/specialist/Login";
import SpecialistPortal from "@/pages/specialist/SpecialistPortal";

import PharmacyLogin from "@/pages/pharmacy/Login";
import PharmacyScanner from "@/pages/pharmacy/Scanner";

import DiagnosticsLogin from "@/pages/diagnostics/Login";
import DiagnosticsOrders from "@/pages/diagnostics/Orders";

import Terms from "@/pages/legal/Terms";
import Privacy from "@/pages/legal/Privacy";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* Patient Routes */}
      <Route path="/patient/login" component={PatientLogin} />
      <Route path="/patient/home" component={PatientHome} />
      <Route path="/patient/intake" component={Intake} />
      <Route path="/patient/consult-waiting" component={ConsultWaiting} />
      <Route path="/patient/prescriptions" component={Prescriptions} />
      <Route path="/patient/prescriptions/:id" component={PrescriptionDetail} />
      <Route path="/patient/diagnostics" component={Diagnostics} />
      <Route path="/patient/profile" component={Profile} />
      
      {/* GP Routes */}
      <Route path="/gp/login" component={GPLogin} />
      <Route path="/gp" component={GPPortal} />
      
      {/* Specialist Routes */}
      <Route path="/specialist/login" component={SpecialistLogin} />
      <Route path="/specialist" component={SpecialistPortal} />
      
      {/* Pharmacy Routes */}
      <Route path="/pharmacy/login" component={PharmacyLogin} />
      <Route path="/pharmacy/scanner" component={PharmacyScanner} />
      
      {/* Diagnostics Routes */}
      <Route path="/diagnostics/login" component={DiagnosticsLogin} />
      <Route path="/diagnostics/orders" component={DiagnosticsOrders} />
      
      {/* Legal Routes */}
      <Route path="/legal/terms" component={Terms} />
      <Route path="/legal/privacy" component={Privacy} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

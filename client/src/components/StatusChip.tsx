import { cn } from "@/lib/utils";
import type { ConsultStatus, PrescriptionStatus, DiagnosticsStatus, ReferralStatus } from "@shared/schema";

type Status = ConsultStatus | PrescriptionStatus | DiagnosticsStatus | ReferralStatus | string;

interface StatusChipProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // Consult statuses
  intake: { label: "Intake", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  queued: { label: "Queued", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  in_progress: { label: "In Progress", className: "bg-healthcare-consult/20 text-healthcare-consult dark:bg-healthcare-consult/30" },
  completed: { label: "Completed", className: "bg-healthcare-completed/20 text-healthcare-completed dark:bg-healthcare-completed/30" },
  
  // Prescription statuses
  active: { label: "Active", className: "bg-healthcare-prescription/20 text-healthcare-prescription dark:bg-healthcare-prescription/30" },
  dispensed: { label: "Dispensed", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  expired: { label: "Expired", className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300" },
  
  // Diagnostics statuses
  ordered: { label: "Ordered", className: "bg-healthcare-diagnostics/20 text-healthcare-diagnostics dark:bg-healthcare-diagnostics/30" },
  sample_collected: { label: "Sample Collected", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  
  // Referral statuses
  proposed: { label: "Proposed", className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  accepted: { label: "Accepted", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  
  // Generic
  awaiting: { label: "Awaiting", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  ready: { label: "Ready", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  collected: { label: "Collected", className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300" },
};

export function StatusChip({ status, className }: StatusChipProps) {
  const config = statusConfig[status] || {
    label: status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    className: "bg-muted text-muted-foreground"
  };

  return (
    <span
      data-testid={`status-${status}`}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

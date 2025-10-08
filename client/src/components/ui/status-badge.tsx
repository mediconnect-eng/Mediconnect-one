import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        info: "bg-info text-info-foreground",
        error: "bg-destructive text-destructive-foreground",
        default: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, variant = "default", ...props }: StatusBadgeProps) {
  return (
    <div 
      className={cn(statusBadgeVariants({ variant }), className)} 
      data-testid={`status-badge-${variant}`}
      {...props} 
    />
  )
}

export { StatusBadge, statusBadgeVariants }

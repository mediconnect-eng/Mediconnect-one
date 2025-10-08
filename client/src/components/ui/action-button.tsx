import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ActionButtonProps {
  icon: ReactNode
  label: string
  onClick?: () => void
  variant?: "default" | "outline"
  className?: string
}

export function ActionButton({ 
  icon, 
  label, 
  onClick, 
  variant = "outline",
  className 
}: ActionButtonProps) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={cn("gap-2", className)}
      data-testid={`action-button-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {icon}
      <span>{label}</span>
    </Button>
  )
}

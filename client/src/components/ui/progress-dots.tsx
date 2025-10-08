import { cn } from "@/lib/utils"

export interface ProgressDotsProps {
  total: number
  current: number
  className?: string
}

export function ProgressDots({ total, current, className }: ProgressDotsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} data-testid="progress-dots">
      {Array.from({ length: total }).map((_, index) => {
        const isCompleted = index <= current
        return (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              isCompleted
                ? "bg-primary"
                : "border-2 border-primary bg-transparent"
            )}
            data-testid={`progress-dot-${index}`}
          />
        )
      })}
    </div>
  )
}

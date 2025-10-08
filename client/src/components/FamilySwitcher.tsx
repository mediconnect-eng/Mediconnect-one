import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export interface FamilyMember {
  id: string
  name: string
  relation?: string
  initial: string
  avatarUrl?: string
}

export interface FamilySwitcherProps {
  members: FamilyMember[]
  activeMemberId: string
  onSwitch: (memberId: string) => void
  className?: string
}

export function FamilySwitcher({ 
  members, 
  activeMemberId, 
  onSwitch,
  className 
}: FamilySwitcherProps) {
  return (
    <div 
      className={cn("flex gap-2 overflow-x-auto scrollbar-hide", className)}
      data-testid="family-switcher"
    >
      {members.map((member) => {
        const isActive = member.id === activeMemberId
        return (
          <button
            key={member.id}
            onClick={() => onSwitch(member.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap",
              "hover-elevate active-elevate-2",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
            data-testid={`family-member-${member.id}`}
          >
            <Avatar className="h-8 w-8">
              {member.avatarUrl && <AvatarImage src={member.avatarUrl} alt={member.name} />}
              <AvatarFallback className={cn(
                isActive ? "bg-primary-foreground/20" : "bg-background"
              )}>
                {member.initial}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium">
              {member.name}
            </div>
          </button>
        )
      })}
    </div>
  )
}

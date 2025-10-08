import { cn } from "@/lib/utils";
import type { Message } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface StaticChatThreadProps {
  messages: Message[];
  currentUserId?: string;
  className?: string;
}

export function StaticChatThread({ messages, currentUserId, className }: StaticChatThreadProps) {
  return (
    <div className={cn("space-y-4 p-4", className)} data-testid="chat-thread">
      {messages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No messages yet</p>
        </div>
      ) : (
        messages.map((message) => {
          const isOwn = message.senderId === currentUserId;
          
          return (
            <div
              key={message.id}
              data-testid={`message-${message.id}`}
              className={cn(
                "flex",
                isOwn ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-lg px-4 py-2 space-y-1",
                  isOwn
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                <p className="text-sm">{message.content}</p>
                {message.createdAt && (
                  <p className={cn(
                    "text-xs",
                    isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </p>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

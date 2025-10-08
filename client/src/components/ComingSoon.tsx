import { useState } from "react";
import { Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface ComingSoonProps {
  feature: string;
  onNotify?: (email: string) => void;
}

export function ComingSoon({ feature, onNotify }: ComingSoonProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && onNotify) {
      onNotify(email);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-foreground">Coming Soon</h2>
          <p className="text-muted-foreground">
            {feature} is currently under development and will be available soon.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="notify-email" className="text-sm font-medium text-foreground block text-left">
                Get notified when it's ready
              </label>
              <Input
                id="notify-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-notify-email"
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              data-testid="button-notify-me"
            >
              <Bell className="mr-2 h-4 w-4" />
              Notify Me
            </Button>
          </form>
        ) : (
          <div className="p-4 bg-accent/20 rounded-lg">
            <p className="text-accent-foreground font-medium">
              Thanks! We'll notify you at {email}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

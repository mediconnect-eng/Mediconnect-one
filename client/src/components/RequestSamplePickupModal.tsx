import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RequestSamplePickupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId?: string;
}

const mockAddresses = [
  { value: "home", label: "Home - 123 Main St" },
  { value: "work", label: "Work - 456 Office Rd" },
];

export function RequestSamplePickupModal({
  open,
  onOpenChange,
  orderId,
}: RequestSamplePickupModalProps) {
  const { toast } = useToast();
  const [address, setAddress] = useState<string>("");
  const [timeWindow, setTimeWindow] = useState<string>("morning");

  const handleRequest = () => {
    if (!address) {
      toast({
        title: "Address required",
        description: "Please select a pickup address",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Pickup requested",
      description: "An agent will contact you on WhatsApp to confirm details",
    });

    onOpenChange(false);
    setAddress("");
    setTimeWindow("morning");
  };

  const handleCancel = () => {
    onOpenChange(false);
    setAddress("");
    setTimeWindow("morning");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-request-pickup">
        <DialogHeader>
          <DialogTitle data-testid="text-modal-title">Request sample pickup</DialogTitle>
          <DialogDescription data-testid="text-modal-description">
            Schedule a home sample pickup service for your diagnostic test
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* WhatsApp Confirmation Note */}
          <Alert data-testid="alert-whatsapp-info">
            <Info className="h-4 w-4" />
            <AlertDescription data-testid="text-whatsapp-info">
              An agent will contact you on WhatsApp to confirm time and fee
            </AlertDescription>
          </Alert>

          {/* Pickup Address */}
          <div className="space-y-2">
            <Label htmlFor="pickup-address" data-testid="label-pickup-address">
              Pickup address
            </Label>
            <Select value={address} onValueChange={setAddress}>
              <SelectTrigger
                id="pickup-address"
                data-testid="select-pickup-address"
              >
                <SelectValue placeholder="Select pickup address" />
              </SelectTrigger>
              <SelectContent>
                {mockAddresses.map((addr) => (
                  <SelectItem
                    key={addr.value}
                    value={addr.value}
                    data-testid={`option-address-${addr.value}`}
                  >
                    {addr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preferred Time Window */}
          <div className="space-y-2">
            <Label data-testid="label-time-window">Preferred time window</Label>
            <RadioGroup
              value={timeWindow}
              onValueChange={setTimeWindow}
              className="grid grid-cols-2 gap-3"
              data-testid="radiogroup-time-window"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="morning"
                  id="morning"
                  data-testid="radio-morning"
                />
                <Label
                  htmlFor="morning"
                  className="font-normal cursor-pointer flex-1"
                  data-testid="label-morning"
                >
                  <div>
                    <div className="font-medium">Morning</div>
                    <div className="text-xs text-muted-foreground">8AM - 12PM</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="afternoon"
                  id="afternoon"
                  data-testid="radio-afternoon"
                />
                <Label
                  htmlFor="afternoon"
                  className="font-normal cursor-pointer flex-1"
                  data-testid="label-afternoon"
                >
                  <div>
                    <div className="font-medium">Afternoon</div>
                    <div className="text-xs text-muted-foreground">1PM - 5PM</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRequest}
            data-testid="button-request"
          >
            Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

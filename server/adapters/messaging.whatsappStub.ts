import type { NotificationPort } from "@shared/ports";

export class WhatsAppMessagingStub implements NotificationPort {
  async notify(topic: string, payload: any): Promise<void> {
    console.log(`[WhatsAppStub] Notification sent:`, { topic, payload });
  }
}

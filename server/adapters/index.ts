import { WhatsAppAuthStub } from "./auth.whatsappStub";
import { WhatsAppMessagingStub } from "./messaging.whatsappStub";
import { QRCodeAdapter } from "./qr.qrcodeAdapter";
import { StorageLocalStub } from "./storage.localStub";
import { AuditStub } from "./audit.stub";
import { storage } from "../storage";
import type { REGISTRY } from "@shared/config";

export interface Adapters {
  auth: WhatsAppAuthStub;
  messaging: WhatsAppMessagingStub;
  qr: QRCodeAdapter;
  storage: StorageLocalStub;
  audit: AuditStub;
}

export function makeAdapters(registry: typeof REGISTRY): Adapters {
  const adapters: any = {};

  if (registry.auth === 'auth.whatsappStub') {
    adapters.auth = new WhatsAppAuthStub(storage);
  } else {
    throw new Error(`Unknown auth adapter: ${registry.auth}`);
  }

  if (registry.messaging === 'messaging.whatsappStub') {
    adapters.messaging = new WhatsAppMessagingStub();
  } else {
    throw new Error(`Unknown messaging adapter: ${registry.messaging}`);
  }

  if (registry.qr === 'qr.localStub') {
    adapters.qr = new QRCodeAdapter();
  } else {
    throw new Error(`Unknown QR adapter: ${registry.qr}`);
  }

  if (registry.storage === 'storage.localStub') {
    adapters.storage = new StorageLocalStub();
  } else {
    throw new Error(`Unknown storage adapter: ${registry.storage}`);
  }

  adapters.audit = new AuditStub();

  return adapters as Adapters;
}

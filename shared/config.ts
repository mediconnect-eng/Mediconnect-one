export const FLAGS = {
  AUTH_WHATSAPP: false,
  MAPS: false,
  PAYMENTS: false,
  REAL_QR: false,
  REAL_UPLOADS: false,
} as const;

export const REGISTRY = {
  auth: 'auth.whatsappStub',
  messaging: 'messaging.whatsappStub',
  qr: FLAGS.REAL_QR ? 'qr.vendorX' : 'qr.localStub',
  storage: FLAGS.REAL_UPLOADS ? 'storage.s3' : 'storage.localStub',
  db: 'db.memoryRepo',
} as const;

export type FlagKey = keyof typeof FLAGS;
export type AdapterKey = keyof typeof REGISTRY;

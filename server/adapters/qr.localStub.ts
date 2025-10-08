export class QRLocalStub {
  async generateQrToken(prescriptionId: string): Promise<string> {
    const token = `QR-${prescriptionId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    console.log(`[QRStub] Generated token: ${token}`);
    return token;
  }

  async validateQrToken(token: string): Promise<boolean> {
    console.log(`[QRStub] Validating token: ${token}`);
    return token.startsWith('QR-');
  }

  async disableQr(prescriptionId: string): Promise<void> {
    console.log(`[QRStub] Disabling QR for prescription: ${prescriptionId}`);
  }
}

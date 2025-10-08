import QRCode from 'qrcode';
import { randomBytes } from 'crypto';

export class QRCodeAdapter {
  async generateQrToken(prescriptionId: string): Promise<string> {
    const randomToken = randomBytes(32).toString('hex');
    const token = `QR-${randomToken}-${prescriptionId}`;
    console.log(`[QRCodeAdapter] Generated secure token for prescription: ${prescriptionId}`);
    return token;
  }

  async generateQR(token: string): Promise<string> {
    try {
      const dataUri = await QRCode.toDataURL(token, { 
        errorCorrectionLevel: 'H',
        width: 256
      });
      console.log(`[QRCodeAdapter] Generated QR image for token: ${token.slice(0, 20)}...`);
      return dataUri;
    } catch (error) {
      console.error('[QRCodeAdapter] Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  async validateQrToken(token: string): Promise<boolean> {
    console.log(`[QRCodeAdapter] Validating token: ${token}`);
    return token.startsWith('QR-');
  }

  async disableQr(prescriptionId: string): Promise<void> {
    console.log(`[QRCodeAdapter] Disabling QR for prescription: ${prescriptionId}`);
  }
}

import QRCode from "qrcode";

class OtpService {
  async generateQrCode(data: string): Promise<string | null> {
    try {
      const qrCode = await QRCode.toDataURL(data);
      return qrCode;
    } catch (err) {
      return null;
    }
  }
}

export default new OtpService();

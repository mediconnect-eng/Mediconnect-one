import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { makeAdapters } from "./adapters";
import { REGISTRY } from "@shared/config";
import type { PharmacyView, IntakeFormData } from "@shared/schema";
import PDFDocument from "pdfkit";

const adapters = makeAdapters(REGISTRY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/request-otp", async (req, res) => {
    try {
      const { phone } = req.body;
      const result = await adapters.auth.requestOtp(phone);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { phone, code } = req.body;
      const result = await adapters.auth.verifyOtp(phone, code);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/mock-login", async (req, res) => {
    try {
      const { identifier, role } = req.body;
      const user = await adapters.auth.mockLogin(identifier, role);
      await adapters.audit.log("mock_login", user.id, "auth", { role });
      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Consult routes
  app.post("/api/consults/intake", async (req, res) => {
    try {
      const { patientId, data } = req.body as { patientId: string; data: IntakeFormData };
      
      const intakeSummary = `Patient reports: ${data.symptoms}. Duration: ${data.duration}. Severity: ${data.severity}.`;
      
      const consult = await storage.createConsult({
        patientId,
        gpId: null,
        status: "intake",
        intakeSummary,
        intakeData: data
      });

      await adapters.audit.log("intake_submitted", patientId, consult.id, data);
      await adapters.messaging.notify("intake_created", { consultId: consult.id });

      res.json(consult);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/consults/:id/queue", async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateConsult(id, { status: "queued" });
      await adapters.messaging.notify("consult_queued", { consultId: id });
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/consults", async (req, res) => {
    try {
      const { role, userId } = req.query as { role: string; userId: string };
      const consults = await storage.listConsults(role as any, userId);
      res.json(consults);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/consults/:id", async (req, res) => {
    try {
      const consult = await storage.getConsult(req.params.id);
      if (!consult) {
        return res.status(404).json({ error: "Consult not found" });
      }
      res.json(consult);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Prescription routes
  app.get("/api/prescriptions", async (req, res) => {
    try {
      const { patientId } = req.query as { patientId: string };
      const prescriptions = await storage.listPrescriptions(patientId);
      res.json(prescriptions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/prescriptions/:id", async (req, res) => {
    try {
      const prescription = await storage.getPrescription(req.params.id);
      if (!prescription) {
        return res.status(404).json({ error: "Prescription not found" });
      }
      res.json(prescription);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/prescriptions/:id/download-pdf", async (req, res) => {
    try {
      const { id } = req.params;
      const prescription = await storage.getPrescription(id);
      
      if (!prescription) {
        return res.status(404).json({ error: "Prescription not found" });
      }

      await adapters.qr.disableQr(id);

      await storage.updatePrescription(id, {
        pdfDownloaded: 1,
        qrDisabled: 1
      });

      await adapters.audit.log("pdf_downloaded", prescription.patientId, id, {
        qrDisabled: true
      });

      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="prescription-${id}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(pdfBuffer);
      });

      doc.fontSize(20).text('PRESCRIPTION', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text('='.repeat(60), { align: 'center' });
      doc.moveDown(1.5);

      doc.fontSize(11).text(`Prescription ID: ${prescription.id}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown(1.5);

      doc.fontSize(14).text('PRESCRIPTION ITEMS:', { underline: true });
      doc.moveDown();

      const items = prescription.items as any[];
      items.forEach((item: any, index: number) => {
        doc.fontSize(12).text(`${index + 1}. ${item.name}`, { continued: false });
        doc.fontSize(10)
          .text(`   Dosage: ${item.dosage}`)
          .text(`   Frequency: ${item.frequency}`)
          .text(`   Duration: ${item.duration}`);
        
        if (item.instructions) {
          doc.text(`   Instructions: ${item.instructions}`);
        }
        doc.moveDown(0.5);
      });

      doc.moveDown(1.5);
      doc.fontSize(12).text('='.repeat(60));
      doc.moveDown();

      doc.fontSize(11).text(`QR Code: ${prescription.qrToken || 'N/A'}`);
      doc.moveDown(0.5);
      
      doc.fontSize(11)
        .fillColor('red')
        .text('Status: DISABLED (PDF Downloaded)', { continued: false });
      
      doc.moveDown(1.5);
      doc.fontSize(9)
        .fillColor('gray')
        .text('Note: The QR code for this prescription has been disabled upon PDF download for security purposes.', {
          align: 'center',
          width: 500
        });

      doc.end();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Pharmacy routes
  app.post("/api/pharmacy/verify", async (req, res) => {
    try {
      const { qrToken } = req.body;
      
      const prescription = await storage.getPrescriptionByQrToken(qrToken);
      
      if (!prescription) {
        return res.status(404).json({ error: "Invalid QR code" });
      }

      if (prescription.qrDisabled) {
        return res.status(400).json({ error: "QR code has been disabled" });
      }

      const pharmacyView: PharmacyView = {
        items: prescription.items as any,
        prescriptionId: prescription.id,
        meta: { noPII: true }
      };

      await adapters.audit.log("qr_verified", "pharmacy", prescription.id, { qrToken });

      res.json(pharmacyView);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Diagnostics routes
  app.get("/api/diagnostics/orders", async (req, res) => {
    try {
      const { userId, role } = req.query as { userId: string; role: string };
      const orders = await storage.listDiagnosticsOrders(userId, role as any);
      
      const minimalPiiOrders = orders.map(order => ({
        id: order.id,
        orderId: order.id,
        testType: order.testType,
        status: order.status,
        createdAt: order.createdAt,
        labId: order.labId,
        resultUrl: order.resultUrl
      }));

      res.json(minimalPiiOrders);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/diagnostics/orders/:id/upload", async (req, res) => {
    try {
      const { id } = req.params;
      const { fileData } = req.body;
      
      const resultUrl = await adapters.storage.put(fileData);
      
      const updated = await storage.updateDiagnosticsOrder(id, {
        status: "completed",
        resultUrl
      });

      await adapters.audit.log("results_uploaded", "lab", id, { resultUrl });

      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Referral routes
  app.get("/api/referrals", async (req, res) => {
    try {
      const { userId, role } = req.query as { userId: string; role: string };
      const referrals = await storage.listReferrals(userId, role as any);
      res.json(referrals);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/referrals", async (req, res) => {
    try {
      const { gpId, patientId, specialistId, reason, notes } = req.body;
      
      const referral = await storage.createReferral({
        gpId,
        patientId,
        specialistId,
        status: "proposed",
        reason,
        notes
      });

      await adapters.messaging.notify("referral_created", { referralId: referral.id });
      res.json(referral);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Messages routes
  app.get("/api/consults/:consultId/messages", async (req, res) => {
    try {
      const messages = await storage.listMessages(req.params.consultId);
      res.json(messages);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/consults/:consultId/messages", async (req, res) => {
    try {
      const { consultId } = req.params;
      const { senderId, content } = req.body;
      
      const message = await storage.createMessage({
        consultId,
        senderId,
        content
      });

      res.json(message);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

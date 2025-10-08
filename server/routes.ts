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
      const { email, phone, role } = req.body;
      
      // Validate email is provided and has valid format
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: "Email is required" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      
      // Validate phone is provided and has valid format (10+ digits)
      if (!phone || typeof phone !== 'string') {
        return res.status(400).json({ error: "Phone number is required" });
      }
      const phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        return res.status(400).json({ error: "Phone number must contain at least 10 digits" });
      }
      
      const user = await adapters.auth.mockLogin(email, phone, role);
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

  app.get("/api/prescriptions/:id/qr-image", async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.query as { userId?: string };
      
      // CRITICAL SECURITY: Verify user is authenticated
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const prescription = await storage.getPrescription(id);
      
      if (!prescription) {
        return res.status(404).json({ error: "Prescription not found" });
      }

      // CRITICAL SECURITY: Verify user has permission to view this prescription
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if user owns this prescription OR is authorized role (pharmacy/gp)
      const isOwner = prescription.patientId === userId;
      const isAuthorizedRole = user.role === "pharmacy" || user.role === "gp";
      
      if (!isOwner && !isAuthorizedRole) {
        return res.status(403).json({ error: "Forbidden" });
      }

      if (!prescription.qrToken) {
        return res.status(400).json({ error: "No QR token available" });
      }

      if (prescription.qrDisabled) {
        return res.status(400).json({ error: "QR code is disabled" });
      }

      const qrDataUri = await adapters.qr.generateQR(prescription.qrToken);
      await adapters.audit.log("qr_image_viewed", userId, id, { role: user.role });
      res.json({ qrDataUri });
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

      if (prescription.fileUrl) {
        return res.json({ ...prescription, fileUrl: prescription.fileUrl });
      }

      await adapters.qr.disableQr(id);

      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', async () => {
        const pdfBuffer = Buffer.concat(buffers);
        
        const { ObjectStorageService } = await import("./objectStorage");
        const objectStorageService = new ObjectStorageService();
        
        const fileUrl = await objectStorageService.uploadBuffer(pdfBuffer, "application/pdf");
        
        const objectFile = await objectStorageService.getObjectEntityFile(fileUrl);
        const { setObjectAclPolicy } = await import("./objectAcl");
        await setObjectAclPolicy(objectFile, {
          owner: prescription.patientId,
          visibility: "private",
        });

        const updated = await storage.updatePrescription(id, {
          pdfDownloaded: 1,
          qrDisabled: 1,
          fileUrl
        });

        await adapters.audit.log("pdf_downloaded", prescription.patientId, id, {
          qrDisabled: true,
          fileUrl
        });

        res.json(updated);
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
      
      const enrichedOrders = await Promise.all(
        orders.map(async (order) => {
          let labInfo = null;
          if (order.labId) {
            const lab = await storage.getUser(order.labId);
            if (lab) {
              const metadata = lab.metadata as { location?: string } | null;
              labInfo = {
                name: lab.name,
                location: metadata?.location || "Location not specified"
              };
            }
          }
          
          return {
            id: order.id,
            orderId: order.id,
            testType: order.testType,
            status: order.status,
            createdAt: order.createdAt,
            labId: order.labId,
            labInfo,
            resultUrl: order.resultUrl
          };
        })
      );

      res.json(enrichedOrders);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/diagnostics/orders/:orderId/upload", async (req, res) => {
    try {
      const { orderId } = req.params;
      const { uploadURL, userId } = req.body;

      if (!uploadURL) {
        return res.status(400).json({ error: "uploadURL is required" });
      }

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        uploadURL,
        {
          owner: userId,
          visibility: "private",
        }
      );

      const updated = await storage.updateDiagnosticsOrder(orderId, {
        status: "completed",
        resultUrl: objectPath
      });

      await adapters.audit.log("results_uploaded", userId, orderId, { resultUrl: objectPath });

      res.json(updated);
    } catch (error: any) {
      console.error("Error uploading diagnostic result:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Object storage routes
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const { ObjectStorageService, ObjectNotFoundError } = await import("./objectStorage");
    const { ObjectPermission } = await import("./objectAcl");
    const { userId } = req.query as { userId?: string };
    
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
        requestedPermission: ObjectPermission.READ,
      });
      if (!canAccess) {
        return res.sendStatus(401);
      }
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", async (req, res) => {
    const { ObjectStorageService } = await import("./objectStorage");
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
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

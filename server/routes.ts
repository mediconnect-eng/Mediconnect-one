import type { Express } from "express";
import { storage } from "./storage";
import { makeAdapters } from "./adapters";
import { REGISTRY } from "@shared/config";
import type { PharmacyView, IntakeFormData, PrescriptionItem, UserRole } from "@shared/schema";
import PDFDocument from "pdfkit";
import { randomUUID } from "crypto";

const adapters = makeAdapters(REGISTRY);

const normalizePhoneDigits = (value?: string): string =>
  (value ?? "").replace(/\D/g, "");

export function registerRoutes(app: Express): void {
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

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { insertUserSchema } = await import("@shared/schema");
      const { z } = await import("zod");
      
      // Validate request body using Zod schema
      const signupSchema = insertUserSchema.extend({
        dateOfBirth: z.string().optional(),
        gender: z.string().optional(),
        agreeToTerms: z.boolean().optional()
      });
      
      const signupData = signupSchema.parse(req.body);
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(signupData.email!);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      // Check if phone already exists
      if (signupData.phone) {
        const existingPhone = await storage.getUserByPhone(signupData.phone);
        if (existingPhone) {
          return res.status(400).json({ error: "Phone number already registered" });
        }
      }
      
      // Validate terms acceptance
      if (!signupData.agreeToTerms) {
        return res.status(400).json({ error: "You must agree to terms and conditions" });
      }
      
      // Create metadata object
      const metadata: any = {};
      if (signupData.dateOfBirth) metadata.dateOfBirth = signupData.dateOfBirth;
      if (signupData.gender) metadata.gender = signupData.gender;
      
      // Create new user with role="patient"
      const newUser = await storage.createUser({
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone,
        role: "patient",
        metadata: Object.keys(metadata).length > 0 ? metadata : null
      });
      
      await adapters.audit.log("user_signup", newUser.id, "auth", { role: "patient" });
      res.json({ user: newUser });
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
      const phoneDigits = normalizePhoneDigits(phone);
      if (phoneDigits.length < 10) {
        return res.status(400).json({ error: "Phone number must contain at least 10 digits" });
      }
      
      // Check if user exists by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found. Please sign up first." });
      }
      
      // Verify phone matches
      const storedPhoneDigits = normalizePhoneDigits(user.phone);
      if (!storedPhoneDigits || storedPhoneDigits !== phoneDigits) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Return user data
      await adapters.audit.log("mock_login", user.id, "auth", { role: user.role });
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

  app.post("/api/consults/:id/accept", async (req, res) => {
    try {
      const { id } = req.params;
      const { gpId } = req.body as { gpId?: string };

      if (!gpId) {
        return res.status(400).json({ error: "gpId is required" });
      }

      const consult = await storage.getConsult(id);
      if (!consult) {
        return res.status(404).json({ error: "Consult not found" });
      }

      if (consult.status === "completed") {
        return res.status(400).json({ error: "Consult already completed" });
      }

      const updated = await storage.updateConsult(id, {
        status: "in_progress",
        gpId,
      });

      await adapters.audit.log("consult_accepted", gpId, id, { status: "in_progress" });
      await adapters.messaging.notify("consult_accepted", { consultId: id, gpId });

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

  app.get("/api/users", async (req, res) => {
    try {
      const { role } = req.query as { role?: string };
      if (role && !["patient", "gp", "specialist", "pharmacy", "diagnostics"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      const users = await storage.listUsers(role as UserRole | undefined);
      res.json(users);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/consults/:id/prescriptions", async (req, res) => {
    try {
      const { id } = req.params;
      const { gpId, items } = req.body as { gpId?: string; items?: PrescriptionItem[] };

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "At least one prescription item is required" });
      }

      const consult = await storage.getConsult(id);
      if (!consult) {
        return res.status(404).json({ error: "Consult not found" });
      }

      const preparedItems = items.map((item) => ({
        ...item,
        id: item.id ?? randomUUID(),
      }));

      const qrToken = await adapters.qr.generateQrToken(id);

      const prescription = await storage.createPrescription({
        patientId: consult.patientId,
        consultId: consult.id,
        status: "active",
        items: preparedItems as any,
        qrToken,
        qrDisabled: 0,
        pdfDownloaded: 0,
      });

      await storage.updateConsult(id, { status: "completed" });

      await adapters.audit.log("prescription_created", gpId ?? "system", prescription.id, {
        consultId: id,
        itemsCount: items.length,
      });
      await adapters.messaging.notify("prescription_created", { consultId: id, prescriptionId: prescription.id });

      res.json(prescription);
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

  app.post("/api/referrals/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, actorId } = req.body as { status?: string; actorId?: string };

      const allowedStatuses = ["proposed", "accepted", "completed"];
      if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const updated = await storage.updateReferral(id, { status: status as any });
      await adapters.audit.log("referral_status_updated", actorId ?? "system", id, { status });
      await adapters.messaging.notify("referral_status_updated", { referralId: id, status });

      res.json(updated);
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
}

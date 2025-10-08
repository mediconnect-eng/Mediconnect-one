import { db } from "./db";
import { users, consults, prescriptions, diagnosticsOrders } from "@shared/schema";
import type { PrescriptionItem } from "@shared/schema";
import { makeAdapters } from "./adapters";
import { REGISTRY } from "@shared/config";

async function seed() {
  console.log("🌱 Seeding database...");

  const adapters = makeAdapters(REGISTRY);

  // Create users
  const [patient] = await db.insert(users).values({
    name: "John Doe",
    phone: "1234567890",
    email: "patient@demo.com",
    role: "patient",
    metadata: {}
  }).returning();

  const [gp] = await db.insert(users).values({
    name: "Dr. Sarah Johnson",
    phone: "+1234567891",
    email: "gp@demo.com",
    role: "gp",
    metadata: {}
  }).returning();

  const [specialist] = await db.insert(users).values({
    name: "Dr. David Williams",
    phone: "+1234567892",
    email: "specialist@demo.com",
    role: "specialist",
    metadata: { specialty: "Cardiology" }
  }).returning();

  const [pharmacy] = await db.insert(users).values({
    name: "HealthCare Pharmacy",
    phone: "+1234567893",
    email: "pharmacy@demo.com",
    role: "pharmacy",
    metadata: {}
  }).returning();

  const [lab] = await db.insert(users).values({
    name: "HealthLab Central",
    phone: "+1234567894",
    email: "lab@demo.com",
    role: "diagnostics",
    metadata: { location: "Valley Arcade, Lavington" }
  }).returning();

  console.log("✅ Created users");

  // Create consult
  const [consult] = await db.insert(consults).values({
    patientId: patient.id,
    gpId: gp.id,
    status: "completed",
    intakeSummary: "Patient reports fever and headache for 3 days. Moderate severity.",
    intakeData: {
      symptoms: "Fever and headache",
      duration: "3 days",
      severity: "moderate",
      medications: "None",
      allergies: "None"
    }
  }).returning();

  console.log("✅ Created consult");

  // Create prescription
  const items: PrescriptionItem[] = [
    {
      id: "1",
      name: "Amoxicillin",
      dosage: "500mg",
      quantity: "21 tablets",
      frequency: "3 times daily",
      duration: "7 days",
      instructions: "Take with food"
    },
    {
      id: "2",
      name: "Ibuprofen",
      dosage: "200mg",
      quantity: "84 tablets",
      frequency: "As needed for pain",
      duration: "14 days",
      instructions: "Do not exceed 6 tablets in 24 hours"
    }
  ];

  const [prescription] = await db.insert(prescriptions).values({
    patientId: patient.id,
    consultId: consult.id,
    status: "active",
    items,
    qrToken: await adapters.qr.generateQrToken(consult.id),
    qrDisabled: 0,
    pdfDownloaded: 0
  }).returning();

  console.log("✅ Created prescription");

  // Create additional labs for variety
  const [lab2] = await db.insert(users).values({
    name: "Lancet Kenya",
    phone: "+1234567895",
    email: "lancet@demo.com",
    role: "diagnostics",
    metadata: { location: "Westlands" }
  }).returning();

  const [lab3] = await db.insert(users).values({
    name: "Pathcare Labs",
    phone: "+1234567896",
    email: "pathcare@demo.com",
    role: "diagnostics",
    metadata: { location: "Karen" }
  }).returning();

  // Create diagnostics orders with varied statuses
  await db.insert(diagnosticsOrders).values([
    {
      patientId: patient.id,
      specialistId: specialist.id,
      labId: lab.id,
      status: "sample_collected",
      testType: "Complete Blood Count (CBC)",
      resultUrl: null
    },
    {
      patientId: patient.id,
      specialistId: specialist.id,
      labId: lab2.id,
      status: "completed",
      testType: "Lipid Profile",
      resultUrl: "local://results-lipid-001"
    },
    {
      patientId: patient.id,
      specialistId: specialist.id,
      labId: lab3.id,
      status: "ordered",
      testType: "Thyroid Function Test",
      resultUrl: null
    }
  ]).returning();

  console.log("✅ Created diagnostics orders");
  console.log("\n🎉 Database seeded successfully!");
  console.log(`\nTest credentials:`);
  console.log(`- Patient: phone=${patient.phone} or email=${patient.email}`);
  console.log(`- GP: phone=${gp.phone} or email=${gp.email}`);
  console.log(`- Specialist: phone=${specialist.phone} or email=${specialist.email}`);
  console.log(`- Pharmacy: phone=${pharmacy.phone} or email=${pharmacy.email}`);
  console.log(`- Diagnostics: phone=${lab.phone} or email=${lab.email}`);
  console.log(`\nTest QR Token: ${prescription.qrToken}`);
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });

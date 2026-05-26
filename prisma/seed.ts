import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const countries = [
  { code: "ID", name: "Indonesia", timezone: "Asia/Jakarta", locale: "id-ID", isActive: true },
  { code: "MY", name: "Malaysia", timezone: "Asia/Kuala_Lumpur", locale: "ms-MY", isActive: true },
];

const malaysiaRegions = [
  { code: "JHR", name: "Johor" },
  { code: "KDH", name: "Kedah" },
  { code: "KTN", name: "Kelantan" },
  { code: "MLK", name: "Melaka" },
  { code: "NSN", name: "Negeri Sembilan" },
  { code: "PHG", name: "Pahang" },
  { code: "PRK", name: "Perak" },
  { code: "PLS", name: "Perlis" },
  { code: "PNG", name: "Pulau Pinang" },
  { code: "SBH", name: "Sabah" },
  { code: "SWK", name: "Sarawak" },
  { code: "SGR", name: "Selangor" },
  { code: "TRG", name: "Terengganu" },
  { code: "KUL", name: "Kuala Lumpur" },
  { code: "LBN", name: "Labuan" },
  { code: "PJY", name: "Putrajaya" },
];

interface HolidayEntry {
  date: string;
  name: string;
  type: string;
  description: string | null;
  region: string | null;
}

interface HolidayFile {
  country: string;
  year: number;
  holidays: HolidayEntry[];
}

async function seedCountries() {
  console.log("Seeding countries...");
  for (const country of countries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: {},
      create: country,
    });
    console.log(`  ✓ ${country.name} (${country.code})`);
  }
}

async function seedRegions() {
  console.log("\nSeeding Malaysia regions...");
  const malaysia = await prisma.country.findUnique({ where: { code: "MY" } });
  if (!malaysia) throw new Error("Malaysia country not found");

  for (const region of malaysiaRegions) {
    await prisma.region.upsert({
      where: { countryId_code: { countryId: malaysia.id, code: region.code } },
      update: {},
      create: { ...region, countryId: malaysia.id },
    });
    console.log(`  ✓ ${region.name} (${region.code})`);
  }
}

async function seedHolidaysFromFile(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const data: HolidayFile = JSON.parse(raw);

  const country = await prisma.country.findUnique({ where: { code: data.country } });
  if (!country) throw new Error(`Country ${data.country} not found`);

  let added = 0;
  let skipped = 0;

  for (const h of data.holidays) {
    let regionId: string | null = null;

    if (h.region) {
      const region = await prisma.region.findUnique({
        where: { countryId_code: { countryId: country.id, code: h.region } },
      });
      if (!region) {
        console.warn(`    ⚠ Region ${h.region} not found, skipping`);
        skipped++;
        continue;
      }
      regionId = region.id;
    }

    const date = new Date(h.date);

    const existing = await prisma.holiday.findFirst({
      where: { countryId: country.id, date, name: h.name, regionId: regionId ?? null },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.holiday.create({
      data: {
        countryId: country.id,
        regionId,
        date,
        type: h.type,
        name: h.name,
        description: h.description,
        isRecurring: false,
      },
    });
    added++;
  }

  console.log(`  ${path.basename(filePath)}: +${added} added, ${skipped} skipped`);
}

async function seedHolidays() {
  console.log("\nSeeding holidays...");
  const dataDir = path.join(__dirname, "data");
  const files = fs.readdirSync(dataDir).filter((f) => f.startsWith("holidays-") && f.endsWith(".json"));

  for (const file of files.sort()) {
    await seedHolidaysFromFile(path.join(dataDir, file));
  }
}

async function main() {
  await seedCountries();
  await seedRegions();
  await seedHolidays();
  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

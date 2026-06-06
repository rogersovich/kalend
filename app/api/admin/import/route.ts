import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

interface HolidayRow {
  date: string;
  name: string;
  type: string;
  description?: string;
  regionCodes?: string | string[];
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({ where: { id: user.id }, select: { role: true } });
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { countryCode, mode, data } = body as {
    countryCode: string;
    mode: "add" | "update";
    data: HolidayRow[] | { holidays: HolidayRow[] };
  };

  const rows: HolidayRow[] = Array.isArray(data) ? data : data.holidays ?? [];

  const country = await prisma.country.findUnique({ where: { code: countryCode } });
  if (!country) return NextResponse.json({ error: `Country ${countryCode} not found` }, { status: 400 });

  const result = { inserted: 0, updated: 0, skipped: 0, errors: [] as string[] };

  for (const row of rows) {
    try {
      const date = new Date(row.date);
      if (isNaN(date.getTime())) throw new Error(`Invalid date: ${row.date}`);

      const rCode = row.regionCodes || (row as any).region;
      const rCodes = rCode ? (Array.isArray(rCode) ? rCode : [rCode]) : [null];

      for (const code of rCodes) {
        let regionId: string | null = null;
        if (code) {
          const region = await prisma.region.findFirst({
            where: { countryId: country.id, code },
          });
          regionId = region?.id ?? null;
        }

        if (mode === "add") {
          const existing = await prisma.holiday.findFirst({
            where: { countryId: country.id, date, regionId },
          });
          if (existing) { result.skipped++; continue; }
          await prisma.holiday.create({
            data: {
              countryId: country.id,
              regionId,
              date,
              name: row.name,
              type: row.type,
              description: row.description ?? null,
            },
          });
          result.inserted++;
        } else {
          const existing = await prisma.holiday.findFirst({
            where: { countryId: country.id, date, regionId },
          });
          if (existing) {
            await prisma.holiday.update({
              where: { id: existing.id },
              data: {
                name: row.name,
                type: row.type,
                description: row.description ?? null,
                regionId,
              },
            });
            result.updated++;
          } else {
            await prisma.holiday.create({
              data: {
                countryId: country.id,
                regionId,
                date,
                name: row.name,
                type: row.type,
                description: row.description ?? null,
              },
            });
            result.inserted++;
          }
        }
      }
    } catch (err) {
      result.errors.push(`[${row.date}] ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  return NextResponse.json({ result });
}

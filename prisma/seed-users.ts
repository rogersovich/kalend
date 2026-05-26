import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const prisma = new PrismaClient();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const SEED_USERS = [
  { email: "user@kalend.dev",  password: "kalend123", name: "Demo User",  role: "user"  },
  { email: "admin@kalend.dev", password: "kalend123", name: "Demo Admin", role: "admin" },
];

async function adminCreateUser(email: string, password: string, name: string) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      "apikey": SERVICE_ROLE_KEY,
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name },
    }),
  });

  const json = await res.json() as { id?: string; email?: string; msg?: string; code?: string; error_description?: string };

  if (!res.ok) {
    console.error("  → Full error response:", JSON.stringify(json, null, 2));
    return { id: null, error: json.msg ?? json.error_description ?? JSON.stringify(json) };
  }
  return { id: json.id!, error: null };
}

async function adminListUsers(): Promise<Array<{ id: string; email: string }>> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?per_page=100`, {
    headers: {
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      "apikey": SERVICE_ROLE_KEY,
    },
  });
  const json = await res.json() as { users?: Array<{ id: string; email: string }> };
  return json.users ?? [];
}

async function main() {
  console.log("Seeding users...\n");

  for (const u of SEED_USERS) {
    let userId: string | null = null;

    const { id, error } = await adminCreateUser(u.email, u.password, u.name);

    if (error) {
      if (error.includes("already registered") || error.includes("already been registered")) {
        console.log(`⚠️  ${u.email} already exists — updating profile only`);
        const users = await adminListUsers();
        const existing = users.find((usr) => usr.email === u.email);
        userId = existing?.id ?? null;
      } else {
        console.error(`✗  Failed to create ${u.email}: ${error}`);
        continue;
      }
    } else {
      userId = id;
      console.log(`✓  Auth user created: ${u.email}`);
    }

    if (!userId) {
      console.error(`✗  Cannot find user ID for ${u.email}`);
      continue;
    }

    await prisma.profile.upsert({
      where: { id: userId },
      create: { id: userId, name: u.name, provider: "email", role: u.role },
      update: { role: u.role, name: u.name },
    });

    console.log(`✓  Profile upserted: ${u.email} [${u.role}]`);
  }

  console.log("\n✅ Done!");
  console.log("─────────────────────────────────────────");
  console.log("  user@kalend.dev   password: kalend123  [user]");
  console.log("  admin@kalend.dev  password: kalend123  [admin]");
  console.log("─────────────────────────────────────────");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

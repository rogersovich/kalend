"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AddEventButton() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
  }, []);

  if (loggedIn === null) return null;

  if (!loggedIn) {
    return (
      <Link
        href="/login"
        className="flex w-full items-center justify-center gap-xs rounded-lg border border-dashed border-brand-accent/40 py-sm text-body-sm text-brand-accent transition-colors hover:bg-brand-accent/5"
      >
        <Plus className="h-4 w-4" />
        Login untuk tambah event
      </Link>
    );
  }

  return (
    <Link
      href="/dashboard/events"
      className="flex w-full items-center justify-center gap-xs rounded-lg bg-brand-accent py-sm text-body-sm font-medium text-white transition-opacity hover:opacity-90"
    >
      <Plus className="h-4 w-4" />
      Tambah Event
    </Link>
  );
}

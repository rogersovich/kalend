"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactFormState {
  success: boolean;
  error?: string;
}

export async function sendContactEmail(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { success: false, error: "Semua field wajib diisi." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Format email tidak valid." };
  }

  if (message.length < 10) {
    return { success: false, error: "Pesan terlalu pendek." };
  }

  try {
    await resend.emails.send({
      from: "Kalend Contact <onboarding@resend.dev>",
      to: ["dimasroger89@gmail.com"],
      replyTo: email,
      subject: `[Kalend Contact] Pesan dari ${name}`,
      text: `Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`,
    });

    return { success: true };
  } catch {
    return { success: false, error: "Gagal mengirim pesan. Coba lagi nanti." };
  }
}

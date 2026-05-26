import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function main() {
  const { data, error } = await resend.emails.send({
    from: "Kalend <onboarding@resend.dev>",
    to: ["dimasroger89@gmail.com"],
    subject: "Test Email — Kalend",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #111;">Kalend Email Test</h1>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Email ini dikirim sebagai test untuk memverifikasi koneksi Resend SMTP di project Kalend.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">
          Dikirim dari: <strong>Kalend</strong> via Resend<br/>
          Waktu: ${new Date().toLocaleString("id-ID")}
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("❌ Gagal kirim email:", error);
    process.exit(1);
  }

  console.log("✅ Email berhasil dikirim!");
  console.log("   ID:", data?.id);
}

main();

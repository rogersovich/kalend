import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Kalend <onboarding@resend.dev>";

export interface ReminderEvent {
  title: string;
  date: string; // formatted display string
  note?: string | null;
  color?: string | null;
}

export async function sendEventReminderEmail(to: string, name: string, events: ReminderEvent[]) {
  return resend.emails.send({
    from: FROM,
    to: [to],
    subject: events.length === 1
      ? `Reminder: "${events[0].title}" is tomorrow — Kalend`
      : `Reminder: ${events.length} events tomorrow — Kalend`,
    html: eventReminderTemplate(name, events),
  });
}

export async function sendApiKeyEmail(to: string, name: string, keyName: string, keyPreview: string) {
  return resend.emails.send({
    from: FROM,
    to: [to],
    subject: `Your API key "${keyName}" has been created — Kalend`,
    html: apiKeyTemplate(name, keyName, keyPreview),
  });
}

export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to: [to],
    subject: "Welcome to Kalend! 🗓️",
    html: welcomeTemplate(name),
  });
}

function welcomeTemplate(name: string): string {
  const firstName = name?.split(" ")[0] ?? "Kamu";
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Inter,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">

          <!-- Header block (lime) -->
          <tr>
            <td style="background:#d4f5a2;padding:40px 40px 32px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(0,0,0,0.5);">Kalend</p>
              <h1 style="margin:0;font-size:32px;font-weight:400;color:#111;line-height:1.2;">
                Hey, ${firstName}! 👋
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 16px;font-size:16px;color:#333;line-height:1.6;">
                Your Kalend account is ready. Here's what you can do:
              </p>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                    <p style="margin:0;font-size:14px;color:#111;">📅 <strong>Indonesia & Malaysia Calendar</strong></p>
                    <p style="margin:4px 0 0 24px;font-size:13px;color:#666;">National holidays, joint leave, Javanese calendar</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                    <p style="margin:0;font-size:14px;color:#111;">🗓️ <strong>Personal Events</strong></p>
                    <p style="margin:4px 0 0 24px;font-size:13px;color:#666;">Save and manage your own events on the calendar</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <p style="margin:0;font-size:14px;color:#111;">🔑 <strong>Public API</strong></p>
                    <p style="margin:4px 0 0 24px;font-size:13px;color:#666;">Access calendar data via REST API with your API key</p>
                  </td>
                </tr>
              </table>

              <table cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
                       style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 28px;border-radius:100px;font-size:14px;font-weight:500;">
                      Go to Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;padding:20px 40px;border-top:1px solid #f0f0f0;">
              <p style="margin:0;font-size:11px;color:#999;line-height:1.6;">
                This email was sent to <strong>${firstName}</strong> because you just created a Kalend account.<br/>
                © ${year} Kalend. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function eventReminderTemplate(name: string, events: ReminderEvent[]): string {
  const firstName = name?.split(" ")[0] ?? "there";
  const year = new Date().getFullYear();

  const eventRows = events.map((e) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
        <p style="margin:0;font-size:15px;font-weight:500;color:#111;">${e.title}</p>
        <p style="margin:3px 0 0;font-size:13px;color:#666;">${e.date}</p>
        ${e.note ? `<p style="margin:4px 0 0;font-size:13px;color:#888;font-style:italic;">${e.note}</p>` : ""}
      </td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Inter,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#e8d5f5;padding:40px 40px 32px;">
            <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(0,0,0,0.5);">Kalend · Reminder</p>
            <h1 style="margin:0;font-size:32px;font-weight:400;color:#111;line-height:1.2;">Tomorrow's Events 🗓️</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <p style="margin:0 0 20px;font-size:16px;color:#333;line-height:1.6;">Hey ${firstName}, here's what's coming up tomorrow:</p>
            <table cellpadding="0" cellspacing="0" width="100%">${eventRows}</table>
            <table cellpadding="0" cellspacing="0" style="margin-top:28px;">
              <tr><td>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/events"
                   style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 28px;border-radius:100px;font-size:14px;font-weight:500;">
                  View All Events
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#fafafa;padding:20px 40px;border-top:1px solid #f0f0f0;">
            <p style="margin:0;font-size:11px;color:#999;line-height:1.6;">
              This reminder was sent to <strong>${firstName}</strong> because you have events scheduled on your Kalend calendar.<br/>
              © ${year} Kalend. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}

function apiKeyTemplate(name: string, keyName: string, keyPreview: string): string {
  const firstName = name?.split(" ")[0] ?? "there";
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Inter,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">

          <!-- Header block (coral) -->
          <tr>
            <td style="background:#ffd6c8;padding:40px 40px 32px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(0,0,0,0.5);">Kalend</p>
              <h1 style="margin:0;font-size:32px;font-weight:400;color:#111;line-height:1.2;">
                New API Key Created 🔑
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 20px;font-size:16px;color:#333;line-height:1.6;">
                Hey ${firstName}, a new API key has been generated for your account.
              </p>

              <table cellpadding="0" cellspacing="0" width="100%" style="background:#f5f5f5;border-radius:8px;margin-bottom:20px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#999;">Key Name</p>
                    <p style="margin:0;font-size:15px;color:#111;font-weight:500;">${keyName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 20px 16px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#999;">Key (first 16 chars)</p>
                    <p style="margin:0;font-size:13px;color:#111;font-family:monospace;background:#e8e8e8;display:inline-block;padding:4px 8px;border-radius:4px;">${keyPreview}...</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px;font-size:14px;color:#666;line-height:1.6;">
                Keep your API key secure — do not share it publicly or commit it to version control.
                If you didn't generate this key, revoke it immediately from your dashboard.
              </p>

              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/api-keys"
                       style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 28px;border-radius:100px;font-size:14px;font-weight:500;">
                      Manage API Keys
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;padding:20px 40px;border-top:1px solid #f0f0f0;">
              <p style="margin:0;font-size:11px;color:#999;line-height:1.6;">
                This email was sent to <strong>${firstName}</strong> because a new API key was created on your Kalend account.<br/>
                © ${year} Kalend. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

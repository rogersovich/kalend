"use client";

import { useFormState, useFormStatus } from "react-dom";
import { sendContactEmail, type ContactFormState } from "./actions";

const initial: ContactFormState = { success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-xs inline-flex items-center justify-center rounded-pill bg-primary px-lg py-xs font-display text-button font-medium text-on-primary transition-colors hover:bg-primary-active disabled:opacity-50"
    >
      {pending ? "Mengirim..." : "Kirim Pesan"}
    </button>
  );
}

export default function ContactForm() {
  const [state, action] = useFormState(sendContactEmail, initial);

  if (state.success) {
    return (
      <div className="flex flex-col items-start gap-md rounded-lg border border-hairline bg-canvas p-xxl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-semantic-success/10 text-semantic-success">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-display text-headline font-medium text-ink">Pesan terkirim!</h3>
        <p className="font-display text-body text-muted">
          Terima kasih sudah menghubungi kami. Kami akan membalas dalam 1–2 hari kerja.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-md">
      {state.error && (
        <p className="rounded-md bg-error/10 px-md py-sm font-display text-body-sm text-error">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-xs">
        <label htmlFor="name" className="font-mono text-caption uppercase tracking-widest text-muted">
          Nama
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Nama kamu"
          className="rounded-md border border-hairline bg-canvas px-md py-sm font-display text-body text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ink/20"
        />
      </div>

      <div className="flex flex-col gap-xs">
        <label htmlFor="email" className="font-mono text-caption uppercase tracking-widest text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="email@kamu.com"
          className="rounded-md border border-hairline bg-canvas px-md py-sm font-display text-body text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ink/20"
        />
      </div>

      <div className="flex flex-col gap-xs">
        <label htmlFor="message" className="font-mono text-caption uppercase tracking-widest text-muted">
          Pesan
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={10}
          placeholder="Tulis pesanmu di sini..."
          className="resize-none rounded-md border border-hairline bg-canvas px-md py-sm font-display text-body text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ink/20"
        />
      </div>

      <SubmitButton />
    </form>
  );
}

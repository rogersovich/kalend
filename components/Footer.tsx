import Link from "next/link";
import { Calendar } from "lucide-react";

const footerLinks = {
  Produk: [
    { href: "/2026", label: "Kalender 2026" },
    { href: "/long-weekends/2026", label: "Long Weekend" },
    { href: "/tools", label: "Tools" },
    { href: "/blog", label: "Blog" },
  ],
  API: [
    { href: "/docs", label: "Dokumentasi" },
    { href: "/dashboard/api-keys", label: "API Keys" },
  ],
  Perusahaan: [
    { href: "/about", label: "Tentang" },
    { href: "/contact", label: "Kontak" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    /* Figma footer: canvas background, ink text, caption for headings */
    <footer className="border-t border-hairline bg-canvas text-ink">
      <div className="mx-auto max-w-content px-lg py-section">
        <div className="grid grid-cols-2 gap-xl md:grid-cols-4">

          {/* Brand wordmark — display weight per Figma spec */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="mb-md flex items-center gap-xs font-display text-display-sm font-semibold text-ink"
            >
              <Calendar className="h-5 w-5" aria-hidden />
              Kalend
            </Link>
            <p className="text-body-sm text-muted leading-relaxed">
              Kalender digital untuk Indonesia dan Malaysia. Hari libur, long
              weekend, dan API publik.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              {/* figmaMono uppercase caption heading */}
              <h3 className="mb-md font-mono text-caption uppercase tracking-widest text-ink font-semibold">
                {section}
              </h3>
              <ul className="flex flex-col gap-xs">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-xxl border-t border-hairline pt-lg">
          <p className="font-mono text-caption uppercase tracking-widest text-muted">
            © {year} Kalend — Kalender Indonesia & Malaysia
          </p>
        </div>
      </div>
    </footer>
  );
}

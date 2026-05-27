import Link from "next/link";
import Image from "next/image";
import calendarIcon from "@/app/assets/icons/calendar.png";

const footerLinks = {
  Produk: [
    { href: "/2026", label: "Kalender 2026" },
    { href: "/long-weekends/2026", label: "Long Weekend" },
    { href: "/tools", label: "Tools" },
    { href: "/blog", label: "Blog" },
  ],
  API: [
    { href: "https://kalend-docs-one.vercel.app", label: "Dokumentasi" },
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
              <Image src={calendarIcon} alt="" width={20} height={20} aria-hidden />
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
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-body-sm text-muted transition-colors hover:text-ink"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-body-sm text-muted transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    )}
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

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
    <footer className="bg-surface-dark text-on-dark-soft">
      <div className="mx-auto max-w-content px-lg py-xxl">
        <div className="grid grid-cols-2 gap-xl md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="mb-md flex items-center gap-xs font-display text-title-sm font-semibold text-white"
            >
              <Calendar className="h-5 w-5 text-brand-accent" aria-hidden />
              Kalend
            </Link>
            <p className="text-body-sm leading-relaxed">
              Kalender digital untuk Indonesia dan Malaysia. Hari libur, long
              weekend, dan API publik.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="mb-md text-caption font-semibold uppercase tracking-wider text-white">
                {section}
              </h3>
              <ul className="flex flex-col gap-xs">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-xxl border-t border-white/10 pt-lg">
          <p className="text-caption text-muted-soft">
            © {year} Kalend. Dibuat dengan ❤️ untuk pekerja Indonesia dan Malaysia.
          </p>
        </div>
      </div>
    </footer>
  );
}

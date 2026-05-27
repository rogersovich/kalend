import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const parent = items.length >= 2 ? items[items.length - 2] : null;

  return (
    <>
      {/* Mobile: ← Parent only */}
      <div className="sm:hidden">
        {parent ? (
          parent.href ? (
            <Link
              href={parent.href}
              className="flex items-center gap-xs font-mono text-caption text-muted transition-colors hover:text-ink"
            >
              <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
              {parent.label}
            </Link>
          ) : (
            <span className="flex items-center gap-xs font-mono text-caption text-ink font-medium">
              <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
              {parent.label}
            </span>
          )
        ) : (
          <span className="font-mono text-caption text-ink font-medium">{items[0]?.label}</span>
        )}
      </div>

      {/* Desktop: full chain */}
      <nav aria-label="Breadcrumb" className="hidden items-center gap-xs text-body-sm text-muted sm:flex">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={i} className="flex min-w-0 items-center gap-xs">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted/50" />}
              {item.href ? (
                <Link href={item.href} className="shrink-0 transition-colors hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span className={`font-medium text-ink${isLast ? " max-w-[240px] truncate" : ""}`}>
                  {item.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}

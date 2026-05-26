import Link from "next/link";
import { LongWeekendPeriod, DayType } from "@/lib/calendar/longweekend";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";
import { cn } from "@/lib/utils";
import { Umbrella } from "lucide-react";

interface LongWeekendRelatedProps {
  period: LongWeekendPeriod | null;
  country: string;
}

const DAY_TYPE_CONFIG: Record<DayType, { label: string; className: string }> = {
  holiday: { label: "Libur", className: "bg-error/10 text-error" },
  "joint-leave": { label: "Cuti", className: "bg-badge-orange/10 text-badge-orange" },
  weekend: { label: "Weekend", className: "bg-surface-strong text-muted" },
  workday: { label: "Kerja", className: "bg-surface-soft text-muted" },
};

function formatRange(start: Date, end: Date): string {
  const s = `${start.getDate()} ${MONTH_NAMES_ID[start.getMonth()]}`;
  const e = `${end.getDate()} ${MONTH_NAMES_ID[end.getMonth()]}`;
  return `${s} – ${e}`;
}

export default function LongWeekendRelated({ period, country }: LongWeekendRelatedProps) {
  if (!period) return null;

  const qs = country !== "ID" ? `?country=${country}` : "";
  const year = period.startDate.getFullYear();

  return (
    <div className="rounded-lg border border-hairline bg-canvas p-lg">
      <div className="mb-md flex items-center gap-xs text-muted">
        <Umbrella className="h-4 w-4" />
        <span className="text-caption font-semibold uppercase tracking-wide">Long Weekend Terkait</span>
      </div>

      <div className="mb-sm">
        <p className="font-display text-title-sm font-semibold text-ink">
          {period.totalDays} hari libur panjang
        </p>
        <p className="text-body-sm text-muted">{formatRange(period.startDate, period.endDate)}</p>
      </div>

      <div className="mb-md flex flex-wrap gap-[3px]">
        {period.days.map((day, i) => {
          const cfg = DAY_TYPE_CONFIG[day.type];
          return (
            <span
              key={i}
              className={cn("rounded-sm px-[6px] py-[2px] text-[10px] font-medium", cfg.className)}
              title={`${day.date.getDate()} ${MONTH_NAMES_ID[day.date.getMonth()]}`}
            >
              {day.date.getDate()}
            </span>
          );
        })}
      </div>

      <Link
        href={`/long-weekends/${year}${qs}`}
        className="text-caption text-brand-accent hover:underline"
      >
        Lihat semua long weekend {year} →
      </Link>
    </div>
  );
}

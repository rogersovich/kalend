import { HolidayData } from "@/lib/calendar/holidays";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";
import { Badge } from "@/components/ui/badge";

interface HolidayListProps {
  holidays: HolidayData[];
  month?: number;
}

const TYPE_LABEL: Record<string, { label: string; className: string }> = {
  national: { label: "Libur Nasional", className: "bg-error/10 text-error border-error/20" },
  "joint-leave": { label: "Cuti Bersama", className: "bg-badge-orange/10 text-badge-orange border-badge-orange/20" },
  regional: { label: "Libur Daerah", className: "bg-badge-violet/10 text-badge-violet border-badge-violet/20" },
};

function formatDate(date: Date, month?: number): string {
  const d = new Date(date);
  const day = d.getDate();
  const m = MONTH_NAMES_ID[d.getMonth()];
  if (month !== undefined) return `${day} ${m}`;
  return `${day} ${m} ${d.getFullYear()}`;
}

export default function HolidayList({ holidays, month }: HolidayListProps) {
  if (holidays.length === 0) {
    return (
      <p className="text-body-sm text-muted italic">
        Tidak ada hari libur{month ? ` bulan ini` : ""}.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-md">
      {holidays.map((h) => {
        const meta = TYPE_LABEL[h.type] ?? TYPE_LABEL.national;
        return (
          <li key={h.id} className="flex flex-col gap-[4px]">
            <div className="flex items-start justify-between gap-xs">
              <span className="text-[13px] font-medium text-ink leading-snug">{h.name}</span>
              <Badge
                variant="outline"
                className={`shrink-0 text-[10px] px-[6px] py-[2px] ${meta.className}`}
              >
                {meta.label}
              </Badge>
            </div>
            <span className="text-caption text-muted">{formatDate(h.date, month)}</span>
          </li>
        );
      })}
    </ul>
  );
}

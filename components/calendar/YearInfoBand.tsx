import { HolidayData } from "@/lib/calendar/holidays";
import { getShio, getHijriYears } from "@/lib/calendar/constants";
import { CalendarDays, Sun, Star } from "lucide-react";

interface YearInfoBandProps {
  year: number;
  holidays: HolidayData[];
  country: string;
}

export default function YearInfoBand({ year, holidays, country }: YearInfoBandProps) {
  const nationalCount = holidays.filter((h) => h.type === "national").length;
  const jointLeaveCount = holidays.filter((h) => h.type === "joint-leave").length;
  const hijri = getHijriYears(year);
  const shio = country === "ID" ? getShio(year) : null;

  const stats = [
    { icon: <CalendarDays className="h-4 w-4" />, label: "Hari Libur Nasional", value: nationalCount },
    { icon: <Sun className="h-4 w-4" />, label: "Cuti Bersama", value: jointLeaveCount },
  ];

  return (
    <div className="rounded-lg border border-hairline bg-surface-soft px-lg py-md">
      <div className="flex flex-wrap items-center gap-lg">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-xs">
            <span className="text-ink/50">{s.icon}</span>
            <span className="font-mono text-title-sm font-semibold text-ink">{s.value}</span>
            <span className="font-display text-body-sm text-ink">{s.label}</span>
          </div>
        ))}

        <div className="flex items-center gap-xs font-display text-body-sm text-ink">
          <span>📅</span>
          <span>{hijri}</span>
        </div>

        {shio && (
          <div className="flex items-center gap-xs font-display text-body-sm text-ink">
            <Star className="h-3.5 w-3.5" />
            <span>Tahun {shio}</span>
          </div>
        )}
      </div>
    </div>
  );
}

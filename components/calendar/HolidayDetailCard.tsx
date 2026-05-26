import { HolidayData } from "@/lib/calendar/holidays";
import { Badge } from "@/components/ui/badge";
import { PartyPopper } from "lucide-react";

interface HolidayDetailCardProps {
  holidays: HolidayData[];
}

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  national: { label: "Libur Nasional", color: "bg-error/10 text-error border-error/20", icon: "🔴" },
  "joint-leave": { label: "Cuti Bersama", color: "bg-badge-orange/10 text-badge-orange border-badge-orange/20", icon: "🟠" },
  regional: { label: "Libur Daerah", color: "bg-badge-violet/10 text-badge-violet border-badge-violet/20", icon: "🟣" },
};

export default function HolidayDetailCard({ holidays }: HolidayDetailCardProps) {
  if (holidays.length === 0) return null;

  return (
    <div className="flex flex-col gap-md">
      {holidays.map((h) => {
        const cfg = TYPE_CONFIG[h.type] ?? TYPE_CONFIG.national;
        return (
          <div key={h.id} className="rounded-lg border border-hairline bg-canvas p-lg">
            <div className="mb-sm flex items-center gap-xs">
              <PartyPopper className="h-4 w-4 text-muted" />
              <span className="text-caption font-semibold uppercase tracking-wide text-muted">
                Hari Libur
              </span>
            </div>

            <div className="flex items-start justify-between gap-sm">
              <h2 className="font-display text-title-md font-semibold text-ink">{h.name}</h2>
              <Badge variant="outline" className={`shrink-0 text-[10px] ${cfg.color}`}>
                {cfg.icon} {cfg.label}
              </Badge>
            </div>

            {h.description && (
              <p className="mt-xs text-body-sm text-muted leading-relaxed">{h.description}</p>
            )}

            {h.regionName && (
              <p className="mt-xs text-caption text-muted">Berlaku di: {h.regionName}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

import { HolidayData } from "@/lib/calendar/holidays";

interface HolidayDetailCardProps {
  holidays: HolidayData[];
}

const TYPE_CONFIG: Record<string, { label: string; bg: string }> = {
  national:      { label: "Libur Nasional", bg: "bg-block-coral" },
  "joint-leave": { label: "Cuti Bersama",   bg: "bg-block-cream" },
  regional:      { label: "Libur Daerah",   bg: "bg-block-lilac" },
};

export default function HolidayDetailCard({ holidays }: HolidayDetailCardProps) {
  if (holidays.length === 0) return null;

  return (
    <div className="flex flex-col gap-md">
      {holidays.map((h) => {
        const cfg = TYPE_CONFIG[h.type] ?? TYPE_CONFIG.national;
        return (
          <div key={h.id} className={`${cfg.bg} rounded-lg p-lg`}>
            <p className="mb-sm font-mono text-caption uppercase tracking-widest text-ink/60">
              {cfg.label}
            </p>
            <h2 className="font-display text-headline font-normal text-ink">{h.name}</h2>
            {h.description && (
              <p className="mt-sm font-display text-body-sm leading-relaxed text-ink">
                {h.description}
              </p>
            )}
            {h.regionName && (
              <p className="mt-xs font-mono text-caption text-ink/60">Berlaku di: {h.regionName}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

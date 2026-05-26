import { HolidayData } from "@/lib/calendar/holidays";
import { getShio, getHijriYears } from "@/lib/calendar/constants";

interface YearInfoBandProps {
  year: number;
  holidays: HolidayData[];
  country: string;
}

const CARD_COLORS = [
  "bg-block-lime",
  "bg-block-coral",
  "bg-block-lilac",
  "bg-block-mint",
];

export default function YearInfoBand({ year, holidays, country }: YearInfoBandProps) {
  const nationalCount = holidays.filter((h) => h.type === "national").length;
  const jointLeaveCount = holidays.filter((h) => h.type === "joint-leave").length;
  const hijri = getHijriYears(year);
  const shio = country === "ID" ? getShio(year) : null;

  const stats = [
    { value: String(nationalCount), label: "Hari Libur Nasional" },
    { value: String(jointLeaveCount), label: "Cuti Bersama" },
    { value: hijri, label: "Tahun Hijriyah" },
    ...(shio ? [{ value: shio, label: "Shio" }] : []),
  ];

  return (
    <div className="grid grid-cols-2 gap-md sm:grid-cols-4">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`${CARD_COLORS[i % CARD_COLORS.length]} rounded-lg p-md`}
        >
          <p className="font-display text-display-sm font-normal text-ink">{s.value}</p>
          <p className="mt-xs font-mono text-caption uppercase tracking-widest text-ink/60">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

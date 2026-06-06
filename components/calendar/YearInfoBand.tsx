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

  // Group regional holidays by date and name to get unique count
  const regionalHolidays = holidays.filter((h) => h.type === "regional");
  const uniqueRegionalKeys = new Set(
    regionalHolidays.map((h) => `${new Date(h.date).toISOString().slice(0, 10)}_${h.name}`)
  );
  const regionalCount = uniqueRegionalKeys.size;

  const hijri = getHijriYears(year);
  const shio = country === "ID" ? getShio(year) : null;

  const stats = [
    { value: String(nationalCount), label: "Hari Libur Nasional" },
    ...(jointLeaveCount > 0 || regionalCount === 0 ? [{ value: String(jointLeaveCount), label: "Cuti Bersama" }] : []),
    ...(regionalCount > 0 ? [{ value: String(regionalCount), label: "Libur Daerah / Regional" }] : []),
    { value: hijri, label: "Tahun Hijriyah" },
    ...(shio ? [{ value: shio, label: "Shio" }] : []),
  ];

  return (
    <div className="grid grid-cols-2 gap-md sm:grid-cols-4">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`${CARD_COLORS[i % CARD_COLORS.length]} rounded-lg p-sm sm:p-md`}
        >
          <p className="font-display text-title-lg sm:text-display-sm font-normal text-ink">{s.value}</p>
          <p className="mt-xs font-mono text-[10px] uppercase tracking-widest text-ink/60 sm:text-caption">{s.label}</p>
        </div>
      ))}
    </div>
  );
}


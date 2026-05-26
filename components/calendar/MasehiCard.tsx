import { DAY_NAMES_FULL_ID, MONTH_NAMES_ID } from "@/lib/calendar/constants";

interface MasehiCardProps {
  date: Date;
}

function getWeekOfMonth(date: Date): number {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  return Math.ceil((date.getDate() + firstDay) / 7);
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export default function MasehiCard({ date }: MasehiCardProps) {
  const dayName = DAY_NAMES_FULL_ID[date.getDay()];
  const monthName = MONTH_NAMES_ID[date.getMonth()];
  const weekNum = getWeekOfMonth(date);
  const dayOfYear = getDayOfYear(date);
  const totalDays = isLeapYear(date.getFullYear()) ? 366 : 365;

  return (
    <div className="rounded-lg bg-block-mint p-lg">
      <p className="mb-md font-mono text-caption uppercase tracking-widest text-ink/60">
        Kalender Masehi
      </p>
      <dl className="grid grid-cols-2 gap-sm">
        <div>
          <dt className="font-mono text-caption uppercase tracking-widest text-ink/50">Hari</dt>
          <dd className="font-display text-body font-normal text-ink">{dayName}</dd>
        </div>
        <div>
          <dt className="font-mono text-caption uppercase tracking-widest text-ink/50">Bulan</dt>
          <dd className="font-display text-body font-normal text-ink">{monthName}</dd>
        </div>
        <div>
          <dt className="font-mono text-caption uppercase tracking-widest text-ink/50">Minggu ke-</dt>
          <dd className="font-display text-body font-normal text-ink">{weekNum} bulan ini</dd>
        </div>
        <div>
          <dt className="font-mono text-caption uppercase tracking-widest text-ink/50">Hari ke-</dt>
          <dd className="font-display text-body font-normal text-ink">{dayOfYear} dari {totalDays}</dd>
        </div>
      </dl>
    </div>
  );
}

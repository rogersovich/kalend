import { DAY_NAMES_FULL_ID, MONTH_NAMES_ID } from "@/lib/calendar/constants";
import { CalendarDays } from "lucide-react";

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
    <div className="rounded-lg border border-hairline bg-canvas p-lg">
      <div className="mb-md flex items-center gap-xs text-muted">
        <CalendarDays className="h-4 w-4" />
        <span className="text-caption font-semibold uppercase tracking-wide">Kalender Masehi</span>
      </div>

      <dl className="grid grid-cols-2 gap-sm">
        <div>
          <dt className="text-caption text-muted">Hari</dt>
          <dd className="text-body-md font-medium text-ink">{dayName}</dd>
        </div>
        <div>
          <dt className="text-caption text-muted">Bulan</dt>
          <dd className="text-body-md font-medium text-ink">{monthName}</dd>
        </div>
        <div>
          <dt className="text-caption text-muted">Minggu ke-</dt>
          <dd className="text-body-md font-medium text-ink">{weekNum} bulan ini</dd>
        </div>
        <div>
          <dt className="text-caption text-muted">Hari ke-</dt>
          <dd className="text-body-md font-medium text-ink">{dayOfYear} dari {totalDays}</dd>
        </div>
      </dl>
    </div>
  );
}

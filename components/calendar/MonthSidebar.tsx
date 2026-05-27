import { HolidayData, countWorkdays } from "@/lib/calendar/holidays";
import EventSidebarSection from "./EventSidebarSection";
import PDFDownloadButton from "@/components/pdf/PDFDownloadButton";

interface MonthSidebarProps {
  year: number;
  month: number;
  country: string;
  holidays: HolidayData[];
}

export default function MonthSidebar({ year, month, country, holidays }: MonthSidebarProps) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  const workdays = countWorkdays(start, end, holidays);

  return (
    <aside className="flex flex-col gap-lg">
      {/* Working days — color block coral */}
      <div className="rounded-lg bg-block-coral p-lg">
        <p className="mb-xs font-mono text-caption uppercase tracking-widest text-ink/60">Hari Kerja</p>
        <p className="font-display text-display-sm font-normal text-ink">{workdays}</p>
        <p className="font-display text-body-sm text-ink">hari kerja bulan ini</p>
      </div>

      <EventSidebarSection year={year} month={month} />

      {/* Download — flat surface */}
      <div className="rounded-lg bg-surface-soft p-lg">
        <h3 className="mb-sm font-mono text-caption uppercase tracking-widest text-ink/60">
          Download
        </h3>
        <PDFDownloadButton year={year} month={month} country={country} holidays={holidays} />
      </div>
    </aside>
  );
}

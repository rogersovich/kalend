import { HolidayData, countWorkdays } from "@/lib/calendar/holidays";
import HolidayList from "./HolidayList";
import AddEventButton from "./AddEventButton";
import PDFDownloadButton from "@/components/pdf/PDFDownloadButton";
import { Briefcase } from "lucide-react";

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
  const nationalHolidays = holidays.filter((h) => h.type === "national");

  return (
    <aside className="flex flex-col gap-lg">
      {/* Working days */}
      <div className="rounded-lg border border-hairline bg-canvas p-lg">
        <div className="flex items-center gap-xs text-muted mb-sm">
          <Briefcase className="h-4 w-4" />
          <span className="text-caption font-semibold uppercase tracking-wide">Hari Kerja</span>
        </div>
        <p className="font-mono text-display-sm font-semibold text-ink">{workdays}</p>
        <p className="text-body-sm text-muted">hari kerja bulan ini</p>
      </div>

      {/* Holiday list */}
      <div className="rounded-lg border border-hairline bg-canvas p-lg">
        <h3 className="mb-md text-caption font-semibold uppercase tracking-wide text-muted">
          Hari Libur Bulan Ini
        </h3>
        <HolidayList holidays={nationalHolidays} month={month} />
      </div>

      {/* Add event */}
      <div className="rounded-lg border border-hairline bg-canvas p-lg">
        <h3 className="mb-sm text-caption font-semibold uppercase tracking-wide text-muted">
          Event Saya
        </h3>
        <AddEventButton />
      </div>

      {/* Download PDF */}
      <div className="rounded-lg border border-hairline bg-canvas p-lg">
        <h3 className="mb-sm text-caption font-semibold uppercase tracking-wide text-muted">
          Download
        </h3>
        <PDFDownloadButton year={year} month={month} country={country} holidays={holidays} />
      </div>
    </aside>
  );
}

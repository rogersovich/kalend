import { HolidayData } from "@/lib/calendar/holidays";
import YearPDFDownloadButton from "@/components/pdf/YearPDFDownloadButton";

interface Props {
  year: number;
  holidays: HolidayData[];
  country: string;
}

export default function YearDownloadSection({ year, holidays, country }: Props) {
  const nationalCount = holidays.filter((h) => h.type === "national").length;
  const jointCount = holidays.filter((h) => h.type === "joint-leave").length;

  // Group regional holidays by date and name to get unique count
  const regionalHolidays = holidays.filter((h) => h.type === "regional");
  const uniqueRegionalKeys = new Set(
    regionalHolidays.map((h) => `${new Date(h.date).toISOString().slice(0, 10)}_${h.name}`)
  );
  const regionalCount = uniqueRegionalKeys.size;

  return (
    <section className="mt-xl sm:mt-xxl">
      <div className="rounded-lg border border-hairline bg-canvas p-md sm:p-lg">
        <div className="flex flex-col gap-md sm:gap-xl sm:items-start sm:justify-between">
          {/* Text */}
          <div className="flex flex-col gap-xs">
            <h2 className="font-display text-title-lg font-normal text-ink sm:text-headline">
              Download Kalender {year}
            </h2>
            <p className="font-display text-[13px] text-ink/60 sm:text-[14px]">
              Download kalender tahun {year} lengkap dengan tanggal merah, hari libur nasional,
              {jointCount > 0 ? " dan cuti bersama" : ""}
              {regionalCount > 0 ? " dan libur regional" : ""} dalam format PDF. Cocok untuk dicetak atau dibagikan.
            </p>
            {/* Stats */}
            <div className="mt-xs flex flex-wrap gap-sm">
              <div className="flex items-center gap-[5px]">
                <span className="h-[6px] w-[6px] rounded-full bg-error" />
                <span className="font-mono text-caption text-ink/50">
                  {nationalCount} hari libur nasional
                </span>
              </div>
              {jointCount > 0 && (
                <div className="flex items-center gap-[5px]">
                  <span className="h-[6px] w-[6px] rounded-full bg-badge-orange" />
                  <span className="font-mono text-caption text-ink/50">
                    {jointCount} cuti bersama
                  </span>
                </div>
              )}
              {regionalCount > 0 && (
                <div className="flex items-center gap-[5px]">
                  <span className="h-[6px] w-[6px] rounded-full bg-badge-emerald" />
                  <span className="font-mono text-caption text-ink/50">
                    {regionalCount} hari libur regional
                  </span>
                </div>
              )}
              <div className="flex items-center gap-[5px]">
                <span className="font-mono text-caption text-ink/40">12 halaman · format A4 landscape</span>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="shrink-0">
            <YearPDFDownloadButton year={year} country={country} holidays={holidays} />
          </div>
        </div>
      </div>
    </section>
  );
}

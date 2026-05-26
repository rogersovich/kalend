"use client";

import dynamic from "next/dynamic";
import { Download } from "lucide-react";
import { HolidayData } from "@/lib/calendar/holidays";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";

interface PDFDownloadButtonProps {
  year: number;
  month: number;
  country: string;
  holidays: HolidayData[];
}

const PDFBundle = dynamic(
  async () => {
    const [{ PDFDownloadLink }, { default: CalendarPDF }] = await Promise.all([
      import("@react-pdf/renderer"),
      import("./CalendarPDF"),
    ]);

    return function PDFBundle({ year, month, country, holidays, fileName }: PDFDownloadButtonProps & { fileName: string }) {
      return (
        <PDFDownloadLink
          document={<CalendarPDF year={year} month={month} country={country} holidays={holidays} />}
          fileName={fileName}
        >
          {({ loading }) => (
            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-xs rounded-lg border border-hairline py-sm text-body-sm font-medium text-muted transition-colors hover:border-brand-accent/40 hover:text-ink disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {loading ? "Menyiapkan PDF..." : "Download PDF"}
            </button>
          )}
        </PDFDownloadLink>
      );
    };
  },
  {
    ssr: false,
    loading: () => (
      <button disabled className="flex w-full items-center justify-center gap-xs rounded-lg border border-hairline py-sm text-body-sm font-medium text-muted opacity-50">
        <Download className="h-4 w-4" />
        Download PDF
      </button>
    ),
  }
);

export default function PDFDownloadButton({ year, month, country, holidays }: PDFDownloadButtonProps) {
  const monthName = MONTH_NAMES_ID[month - 1];
  const fileName = `kalend-${year}-${String(month).padStart(2, "0")}-${monthName.toLowerCase()}.pdf`;

  return <PDFBundle year={year} month={month} country={country} holidays={holidays} fileName={fileName} />;
}

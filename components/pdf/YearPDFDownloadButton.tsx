"use client";

import dynamic from "next/dynamic";
import { Download } from "lucide-react";
import { HolidayData } from "@/lib/calendar/holidays";

interface Props {
  year: number;
  country: string;
  holidays: HolidayData[];
}

const PDFBundle = dynamic(
  async () => {
    const [{ PDFDownloadLink }, { default: YearCalendarPDF }] = await Promise.all([
      import("@react-pdf/renderer"),
      import("./YearCalendarPDF"),
    ]);

    return function PDFBundle({ year, country, holidays, fileName }: Props & { fileName: string }) {
      return (
        <PDFDownloadLink
          document={<YearCalendarPDF year={year} country={country} holidays={holidays} />}
          fileName={fileName}
        >
          {({ loading }) => (
            <button
              disabled={loading}
              className="flex w-full justify-center items-center gap-xs rounded-lg bg-ink px-lg py-sm font-display text-[12px] sm:w-auto sm:justify-start sm:text-body-sm font-medium text-white transition-colors hover:bg-primary-active disabled:opacity-50 mt-2 sm:mt-0"
            >
              <Download className="h-4 w-4" />
              {loading ? "Menyiapkan PDF..." : "Download PDF Kalender"}
            </button>
          )}
        </PDFDownloadLink>
      );
    };
  },
  {
    ssr: false,
    loading: () => (
      <button disabled className="flex w-full justify-center items-center gap-xs rounded-lg bg-ink px-lg py-sm font-display text-[12px] sm:w-auto sm:justify-start sm:text-body-sm font-medium text-white opacity-50 mt-2 sm:mt-0">
        <Download className="h-4 w-4" />
        Download PDF Kalender
      </button>
    ),
  }
);

export default function YearPDFDownloadButton({ year, country, holidays }: Props) {
  const fileName = `kalend-${year}-${country.toLowerCase()}.pdf`;
  return <PDFBundle year={year} country={country} holidays={holidays} fileName={fileName} />;
}

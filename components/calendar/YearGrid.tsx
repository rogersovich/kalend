import { HolidayData } from "@/lib/calendar/holidays";
import MonthMini from "./MonthMini";

interface YearGridProps {
  year: number;
  holidays: HolidayData[];
  country: string;
}

export default function YearGrid({ year, holidays, country }: YearGridProps) {
  return (
    <div className="grid grid-cols-2 gap-md sm:grid-cols-3 lg:grid-cols-3">
      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
        const monthHolidays = holidays.filter((h) => {
          const d = new Date(h.date);
          return d.getMonth() + 1 === month && d.getFullYear() === year;
        });

        return (
          <MonthMini
            key={month}
            year={year}
            month={month}
            holidays={monthHolidays}
            country={country}
          />
        );
      })}
    </div>
  );
}

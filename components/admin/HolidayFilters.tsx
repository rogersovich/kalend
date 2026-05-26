"use client";

const selectCls = "rounded-md border border-hairline bg-canvas px-md py-xs font-display text-body-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink";

interface HolidayFiltersProps {
  country: string;
  year: number;
}

export default function HolidayFilters({ country, year }: HolidayFiltersProps) {
  function navigate(nextCountry: string, nextYear: number) {
    window.location.href = `/admin/holidays?country=${nextCountry}&year=${nextYear}`;
  }

  return (
    <div className="flex gap-sm">
      <select
        defaultValue={country}
        onChange={(e) => navigate(e.target.value, year)}
        className={selectCls}
      >
        <option value="ID">Indonesia</option>
        <option value="MY">Malaysia</option>
      </select>
      <select
        defaultValue={year}
        onChange={(e) => navigate(country, Number(e.target.value))}
        className={selectCls}
      >
        {Array.from({ length: 11 }, (_, i) => 2020 + i).map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}

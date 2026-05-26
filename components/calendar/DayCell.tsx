import { cn } from "@/lib/utils";
import { HolidayData } from "@/lib/calendar/holidays";
import { calculateWeton } from "@/lib/calendar/weton";

interface DayCellProps {
  date: Date;
  holidays: HolidayData[];
  isCurrentMonth?: boolean;
  isToday?: boolean;
  showWeton?: boolean;
  size?: "mini" | "full";
  eventColors?: string[];
  onClick?: () => void;
}

function getDotColors(holidays: HolidayData[]) {
  const hasNational = holidays.some((h) => h.type === "national");
  const hasJoint = holidays.some((h) => h.type === "joint-leave");
  return { hasNational, hasJoint };
}

export default function DayCell({
  date,
  holidays,
  isCurrentMonth = true,
  isToday = false,
  showWeton = false,
  size = "mini",
  eventColors = [],
  onClick,
}: DayCellProps) {
  const day = date.getDate();
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const { hasNational, hasJoint } = getDotColors(holidays);
  const isHoliday = hasNational || hasJoint;

  const weton = showWeton ? calculateWeton(date) : null;

  if (size === "mini") {
    return (
      <div
        className={cn(
          "relative flex flex-col items-center justify-start py-[2px]",
          !isCurrentMonth && "opacity-30",
          onClick && "cursor-pointer"
        )}
        onClick={onClick}
      >
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px] leading-none",
            isToday && "ring-2 ring-brand-accent ring-offset-1",
            isWeekend && !isHoliday && "text-muted",
            hasNational && "font-semibold text-error",
            hasJoint && !hasNational && "font-semibold text-badge-orange",
            isWeekend && "bg-surface-strong/60"
          )}
        >
          {day}
        </span>
        {/* dots */}
        <div className="mt-[2px] flex gap-[2px]">
          {hasNational && (
            <span className="h-[4px] w-[4px] rounded-full bg-error" />
          )}
          {hasJoint && (
            <span className="h-[4px] w-[4px] rounded-full bg-badge-orange" />
          )}
        </div>
      </div>
    );
  }

  // full size (monthly view)
  return (
    <div
      className={cn(
        "min-h-[60px] border-b border-r border-hairline p-1",
        !isCurrentMonth && "bg-surface-soft/50",
        isWeekend && "bg-surface-strong/30",
        onClick && "cursor-pointer hover:bg-surface-soft transition-colors"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full font-mono text-sm",
            isToday && "bg-brand-accent font-semibold text-white",
            !isToday && hasNational && "font-semibold text-error",
            !isToday && hasJoint && !hasNational && "font-semibold text-badge-orange",
            !isCurrentMonth && "text-muted"
          )}
        >
          {day}
        </span>
        <div className="flex gap-[3px] pt-1">
          {hasNational && (
            <span className="h-[5px] w-[5px] rounded-full bg-error" />
          )}
          {hasJoint && (
            <span className="h-[5px] w-[5px] rounded-full bg-badge-orange" />
          )}
          {eventColors.slice(0, 2).map((color, idx) => (
            <span key={idx} className="h-[5px] w-[5px] rounded-full" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>
      {showWeton && weton && (
        <p className="mt-1 truncate text-[10px] leading-none text-muted">
          {weton.pasaran}
        </p>
      )}
    </div>
  );
}

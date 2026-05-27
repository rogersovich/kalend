"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { HolidayData } from "@/lib/calendar/holidays";
import { calculateWeton } from "@/lib/calendar/weton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DayCellProps {
  date: Date;
  holidays: HolidayData[];
  isCurrentMonth?: boolean;
  isToday?: boolean;
  showWeton?: boolean;
  size?: "mini" | "full";
  events?: { color: string; title: string }[];
  isLastRow?: boolean;
  isLastCol?: boolean;
  onClick?: () => void;
  href?: string;
}

function getDotColors(holidays: HolidayData[]) {
  const hasNational = holidays.some((h) => h.type === "national");
  const hasJoint = holidays.some((h) => h.type === "joint-leave");
  return { hasNational, hasJoint };
}

const TYPE_LABEL: Record<string, { label: string; color: string }> = {
  national:    { label: "Libur Nasional", color: "bg-error" },
  "joint-leave": { label: "Cuti Bersama", color: "bg-badge-orange" },
  regional:    { label: "Libur Daerah", color: "bg-primary" },
};

export default function DayCell({
  date,
  holidays,
  isCurrentMonth = true,
  isToday = false,
  showWeton = false,
  size = "mini",
  events = [],
  isLastRow = false,
  isLastCol = false,
  onClick,
  href,
}: DayCellProps) {
  const day = date.getDate();
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const { hasNational, hasJoint } = getDotColors(holidays);
  const isHoliday = hasNational || hasJoint;

  const weton = showWeton ? calculateWeton(date) : null;

  const isClickable = !!(href || onClick) && isCurrentMonth;

  if (size === "mini") {
    const inner = (
      <div
        className={cn(
          "relative flex flex-col items-center justify-start rounded py-[2px] transition-colors",
          !isCurrentMonth && "opacity-30",
          isClickable && "cursor-pointer hover:font-bold"
        )}
        onClick={onClick}
      >
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px] sm:text-[12px] leading-none",
            isToday && "font-bold text-[12px] bg-accent-magenta text-white",
            isWeekend && !isHoliday && !isToday && "text-muted",
            !isToday && hasNational && "font-semibold text-error",
            !isToday && hasJoint && !hasNational && "font-semibold text-badge-orange",
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
          {events.slice(0, 2).map((ev, idx) => (
            <span key={idx} className="h-[4px] w-[4px] rounded-full" style={{ backgroundColor: ev.color }} />
          ))}
        </div>
      </div>
    );

    const cell = href && isCurrentMonth
      ? <Link href={href} className="block">{inner}</Link>
      : inner;

    const hasEvents = events.length > 0;
    if ((!isHoliday && !hasEvents) || !isCurrentMonth) return cell;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{cell}</TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex flex-col gap-[6px]">
            {holidays.map((h) => {
              const meta = TYPE_LABEL[h.type] ?? { label: h.type, color: "bg-muted" };
              return (
                <div key={h.id ?? h.name} className="flex flex-col gap-[2px]">
                  <p className="font-display text-[12px] font-medium leading-snug text-white">
                    {h.name}
                  </p>
                  <div className="flex items-center gap-[4px]">
                    <span className={cn("h-[6px] w-[6px] shrink-0 rounded-full", meta.color)} />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/60">
                      {meta.label}
                    </span>
                  </div>
                </div>
              );
            })}
            {hasEvents && holidays.length > 0 && (
              <div className="border-t border-white/10 pt-[4px]" />
            )}
            {events.map((ev, idx) => (
              <div key={idx} className="flex items-center gap-[6px]">
                <span className="h-[6px] w-[6px] shrink-0 rounded-full" style={{ backgroundColor: ev.color }} />
                <p className="font-display text-[12px] font-medium leading-snug text-white">
                  {ev.title}
                </p>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  // full size (monthly view)
  const fullCellContent = (
    <>
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full font-mono text-sm",
            isToday && "bg-accent-magenta font-semibold text-white",
            !isToday && hasNational && "font-semibold text-error",
            !isToday && hasJoint && !hasNational && "font-semibold text-badge-orange",
            !isCurrentMonth && "text-muted"
          )}
        >
          {day}
        </span>
        <div className="flex gap-[3px] pt-1">
          {hasNational && <span className="h-[5px] w-[5px] rounded-full bg-error" />}
          {hasJoint && <span className="h-[5px] w-[5px] rounded-full bg-badge-orange" />}
          {events.slice(0, 2).map((ev, idx) => (
            <span key={idx} className="h-[5px] w-[5px] rounded-full" style={{ backgroundColor: ev.color }} />
          ))}
        </div>
      </div>
      {showWeton && weton && (
        <p className="mt-1 truncate font-mono text-[10px] leading-5 text-ink/50">{weton.pasaran}</p>
      )}
    </>
  );

  const fullCellCls = cn(
    "min-h-[60px] p-1.5 transition-colors",
    !isLastRow && "border-b border-hairline",
    !isLastCol && "border-r border-hairline",
    !isCurrentMonth && "bg-surface-soft/50",
    isWeekend && isCurrentMonth && "bg-surface-strong/30",
    isClickable && "cursor-pointer",
    isClickable && isWeekend && isCurrentMonth && "hover:bg-surface-strong/50",
    isClickable && (!isWeekend || !isCurrentMonth) && "hover:bg-surface-soft"
  );

  const fullCell = href && isCurrentMonth
    ? <Link href={href} className={fullCellCls}>{fullCellContent}</Link>
    : <div className={fullCellCls} onClick={onClick}>{fullCellContent}</div>;

  const hasEvents = events.length > 0;
  if ((!isHoliday && !hasEvents) || !isCurrentMonth) return fullCell;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{fullCell}</TooltipTrigger>
      <TooltipContent side="top">
        <div className="flex flex-col gap-[6px]">
          {holidays.map((h) => {
            const meta = TYPE_LABEL[h.type] ?? { label: h.type, color: "bg-muted" };
            return (
              <div key={h.id ?? h.name} className="flex flex-col gap-[2px]">
                <p className="font-display text-[12px] font-medium leading-snug text-white">
                  {h.name}
                </p>
                <div className="flex items-center gap-[4px]">
                  <span className={cn("h-[6px] w-[6px] shrink-0 rounded-full", meta.color)} />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/60">
                    {meta.label}
                  </span>
                </div>
              </div>
            );
          })}
          {hasEvents && holidays.length > 0 && (
            <div className="border-t border-white/10 pt-[4px]" />
          )}
          {events.map((ev, idx) => (
            <div key={idx} className="flex items-center gap-[6px]">
              <span className="h-[6px] w-[6px] shrink-0 rounded-full" style={{ backgroundColor: ev.color }} />
              <p className="font-display text-[12px] font-medium leading-snug text-white">
                {ev.title}
              </p>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

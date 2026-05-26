import { HolidayData } from "./holidays";

export type DayType = "holiday" | "joint-leave" | "weekend" | "workday";

export interface DayInfo {
  date: Date;
  dateStr: string;
  type: DayType;
  holiday?: HolidayData;
}

export interface LongWeekendPeriod {
  startDate: Date;
  endDate: Date;
  totalDays: number;
  days: DayInfo[];
  holidays: HolidayData[];
  jointLeaves: HolidayData[];
}

export function calculateLongWeekends(
  year: number,
  holidays: HolidayData[],
  minDays = 3
): LongWeekendPeriod[] {
  const holidayMap = new Map<string, HolidayData[]>();
  for (const h of holidays) {
    const key = h.date.toISOString().slice(0, 10);
    const existing = holidayMap.get(key) ?? [];
    holidayMap.set(key, [...existing, h]);
  }

  function getDayType(date: Date): DayType {
    const key = date.toISOString().slice(0, 10);
    const matches = holidayMap.get(key);
    if (matches) {
      const hasJoint = matches.some((h) => h.type === "joint-leave");
      const hasHoliday = matches.some((h) => h.type === "national" || h.type === "regional");
      if (hasHoliday) return "holiday";
      if (hasJoint) return "joint-leave";
    }
    const day = date.getDay();
    if (day === 0 || day === 6) return "weekend";
    return "workday";
  }

  // Build all days of the year
  const allDays: DayInfo[] = [];
  const cur = new Date(`${year}-01-01`);
  const yearEnd = new Date(`${year}-12-31`);

  while (cur <= yearEnd) {
    const dateStr = cur.toISOString().slice(0, 10);
    const type = getDayType(cur);
    const holidayEntries = holidayMap.get(dateStr);
    allDays.push({
      date: new Date(cur),
      dateStr,
      type,
      holiday: holidayEntries?.[0],
    });
    cur.setDate(cur.getDate() + 1);
  }

  // Find contiguous non-workday streaks
  const periods: LongWeekendPeriod[] = [];
  let i = 0;

  while (i < allDays.length) {
    const day = allDays[i];
    if (day.type === "workday") {
      i++;
      continue;
    }

    // Start of a non-workday streak
    const streakStart = i;
    while (i < allDays.length && allDays[i].type !== "workday") {
      i++;
    }
    const streakEnd = i - 1;
    const streakDays = allDays.slice(streakStart, streakEnd + 1);

    if (streakDays.length < minDays) continue;

    // Only include if streak contains at least one actual holiday or joint-leave
    const hasHoliday = streakDays.some(
      (d) => d.type === "holiday" || d.type === "joint-leave"
    );
    if (!hasHoliday) continue;

    const periodHolidays = streakDays
      .filter((d) => d.type === "holiday" && d.holiday)
      .map((d) => d.holiday!);

    const periodJointLeaves = streakDays
      .filter((d) => d.type === "joint-leave" && d.holiday)
      .map((d) => d.holiday!);

    periods.push({
      startDate: streakDays[0].date,
      endDate: streakDays[streakDays.length - 1].date,
      totalDays: streakDays.length,
      days: streakDays,
      holidays: periodHolidays,
      jointLeaves: periodJointLeaves,
    });
  }

  return periods;
}

export interface LeaveStrategy {
  leaveDates: Date[];
  totalDaysOff: number;
  ratio: number;
  period: {
    startDate: Date;
    endDate: Date;
    totalDays: number;
    days: DayInfo[];
  };
}

export function calculateLeaveStrategies(
  year: number,
  holidays: HolidayData[],
  maxLeave: number
): LeaveStrategy[] {
  if (maxLeave === 0) {
    return calculateLongWeekends(year, holidays, 3).map((p) => ({
      leaveDates: [],
      totalDaysOff: p.totalDays,
      ratio: 0,
      period: p,
    }));
  }

  const holidaySet = new Set<string>();
  const weekendSet = new Set<string>();

  for (const h of holidays) {
    holidaySet.add(h.date.toISOString().slice(0, 10));
  }

  const cur = new Date(`${year}-01-01`);
  const yearEnd = new Date(`${year}-12-31`);
  while (cur <= yearEnd) {
    const d = cur.getDay();
    if (d === 0 || d === 6) weekendSet.add(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }

  const strategies: LeaveStrategy[] = [];

  function isNonWorkday(dateStr: string): boolean {
    return holidaySet.has(dateStr) || weekendSet.has(dateStr);
  }

  function isWorkday(dateStr: string): boolean {
    return !isNonWorkday(dateStr);
  }

  // For each holiday, try adding 1..maxLeave adjacent workdays
  const uniqueHolidayDates = [...new Set(holidays.map((h) => h.date.toISOString().slice(0, 10)))];

  for (const hDateStr of uniqueHolidayDates) {
    for (let leaveCount = 1; leaveCount <= maxLeave; leaveCount++) {
      // Try expanding before and after the holiday
      const hDate = new Date(hDateStr);

      // Find natural non-workday block around this holiday
      const blockStart = new Date(hDate);
      while (isNonWorkday(new Date(blockStart.getTime() - 86400000).toISOString().slice(0, 10))) {
        blockStart.setDate(blockStart.getDate() - 1);
      }
      const blockEnd = new Date(hDate);
      while (isNonWorkday(new Date(blockEnd.getTime() + 86400000).toISOString().slice(0, 10))) {
        blockEnd.setDate(blockEnd.getDate() + 1);
      }

      // Try adding workdays before blockStart
      const leaveBefore: Date[] = [];
      const tempDate = new Date(blockStart);
      for (let l = 0; l < leaveCount; l++) {
        tempDate.setDate(tempDate.getDate() - 1);
        const ds = tempDate.toISOString().slice(0, 10);
        if (isWorkday(ds) && tempDate.getFullYear() === year) {
          leaveBefore.unshift(new Date(tempDate));
        }
      }

      if (leaveBefore.length === leaveCount) {
        const totalStart = leaveBefore[0];
        const totalEnd = blockEnd;
        const days: DayInfo[] = [];
        const c = new Date(totalStart);
        while (c <= totalEnd) {
          const ds = c.toISOString().slice(0, 10);
          const isHol = holidaySet.has(ds);
          const type: DayType = isHol ? "holiday" : weekendSet.has(ds) ? "weekend" : "joint-leave";
          days.push({ date: new Date(c), dateStr: ds, type });
          c.setDate(c.getDate() + 1);
        }
        const totalDaysOff = days.length;
        if (totalDaysOff >= 3 && leaveBefore.length > 0) {
          strategies.push({
            leaveDates: leaveBefore,
            totalDaysOff,
            ratio: totalDaysOff / leaveCount,
            period: { startDate: totalStart, endDate: totalEnd, totalDays: totalDaysOff, days },
          });
        }
      }

      // Try adding workdays after blockEnd
      const leaveAfter: Date[] = [];
      const tempDate2 = new Date(blockEnd);
      for (let l = 0; l < leaveCount; l++) {
        tempDate2.setDate(tempDate2.getDate() + 1);
        const ds = tempDate2.toISOString().slice(0, 10);
        if (isWorkday(ds) && tempDate2.getFullYear() === year) {
          leaveAfter.push(new Date(tempDate2));
        }
      }

      if (leaveAfter.length === leaveCount) {
        const totalStart = blockStart;
        const totalEnd = leaveAfter[leaveAfter.length - 1];
        const days: DayInfo[] = [];
        const c = new Date(totalStart);
        while (c <= totalEnd) {
          const ds = c.toISOString().slice(0, 10);
          const isHol = holidaySet.has(ds);
          const type: DayType = isHol ? "holiday" : weekendSet.has(ds) ? "weekend" : "joint-leave";
          days.push({ date: new Date(c), dateStr: ds, type });
          c.setDate(c.getDate() + 1);
        }
        const totalDaysOff = days.length;
        if (totalDaysOff >= 3 && leaveAfter.length > 0) {
          strategies.push({
            leaveDates: leaveAfter,
            totalDaysOff,
            ratio: totalDaysOff / leaveCount,
            period: { startDate: totalStart, endDate: totalEnd, totalDays: totalDaysOff, days },
          });
        }
      }
    }
  }

  // Deduplicate and sort by ratio desc
  const seen = new Set<string>();
  const unique = strategies.filter((s) => {
    const key = `${s.period.startDate.toISOString()}-${s.period.endDate.toISOString()}-${s.leaveDates.map((d) => d.toISOString()).join(",")}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.sort((a, b) => b.ratio - a.ratio || b.totalDaysOff - a.totalDaysOff);
}

"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { HolidayData } from "@/lib/calendar/holidays";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";

Font.register({
  family: "PlusJakartaSans",
  fonts: [
    { src: "/fonts/PlusJakartaSans.ttf", fontWeight: 400 },
    { src: "/fonts/PlusJakartaSans.ttf", fontWeight: 700 },
  ],
});

Font.register({
  family: "JetBrainsMono",
  src: "/fonts/JetBrainsMono-Regular.ttf",
});

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const RED = "#ef4444";
const ORANGE = "#f59e0b";
const EMERALD = "#10b981";
const GRAY_BG = "#f4f4f5";
const MUTED = "#71717a";
const INK = "#09090b";
const HAIRLINE = "#e4e4e7";

const styles = StyleSheet.create({
  page: {
    fontFamily: "PlusJakartaSans",
    padding: 32,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: INK,
  },
  subtitle: {
    fontSize: 9,
    color: MUTED,
    marginTop: 1,
  },
  gridContainer: {
    flexDirection: "row",
    gap: 16,
  },
  calGrid: { flex: 1 },
  sidebar: { width: 160 },
  dayHeaderRow: {
    flexDirection: "row",
    marginBottom: 0,
  },
  dayHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 7,
    fontWeight: 700,
    color: MUTED,
    paddingBottom: 4,
    paddingTop: 2,
    borderBottom: `1px solid ${HAIRLINE}`,
  },
  weekRow: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    minHeight: 72,
    borderBottom: `1px solid ${HAIRLINE}`,
    borderRight: `1px solid ${HAIRLINE}`,
    padding: 4,
  },
  cellEmpty: {
    flex: 1,
    minHeight: 72,
    borderBottom: `1px solid ${HAIRLINE}`,
    borderRight: `1px solid ${HAIRLINE}`,
    padding: 4,
    backgroundColor: GRAY_BG,
  },
  cellWeekend: {
    backgroundColor: "#fafafa",
  },
  dayNum: {
    fontFamily: "PlusJakartaSans",
    fontSize: 10,
    color: INK,
  },
  dayNumHoliday: { color: RED },
  dayNumJoint: { color: ORANGE },
  dayNumRegional: { color: EMERALD },
  holidayName: {
    fontSize: 6,
    color: RED,
    marginTop: 2,
    lineHeight: 1.3,
  },
  jointName: {
    fontSize: 6,
    color: ORANGE,
    marginTop: 2,
    lineHeight: 1.3,
  },
  regionalName: {
    fontSize: 6,
    color: EMERALD,
    marginTop: 2,
    lineHeight: 1.3,
  },
  sidebarTitle: {
    fontSize: 7,
    fontWeight: 700,
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    borderBottom: `1px solid ${HAIRLINE}`,
    paddingBottom: 4,
  },
  holidayItem: {
    marginBottom: 8,
  },
  holidayDate: {
    fontFamily: "PlusJakartaSans",
    fontSize: 7,
    color: MUTED,
    marginBottom: 1,
  },
  holidayItemName: {
    fontSize: 7.5,
    color: INK,
    lineHeight: 1.4,
  },
  legend: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 7,
    color: MUTED,
  },
});

function buildMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: Array<{ day: number | null; isWeekend: boolean }> = [];

  for (let i = 0; i < firstDay; i++) cells.push({ day: null, isWeekend: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month - 1, d).getDay();
    cells.push({ day: d, isWeekend: dow === 0 || dow === 6 });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, isWeekend: false });

  const weeks: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function getHolidayForDay(holidays: HolidayData[], year: number, month: number, day: number) {
  return holidays.filter((h) => {
    const hd = new Date(h.date);
    return hd.getFullYear() === year && hd.getMonth() + 1 === month && hd.getDate() === day;
  });
}

interface CalendarPDFProps {
  year: number;
  month: number;
  country: string;
  holidays: HolidayData[];
}

export default function CalendarPDF({ year, month, country, holidays }: CalendarPDFProps) {
  const monthName = MONTH_NAMES_ID[month - 1];
  const weeks = buildMonthGrid(year, month);
  const national = holidays.filter((h) => h.type === "national");
  const joint = holidays.filter((h) => h.type === "joint-leave");
  const regional = holidays.filter((h) => h.type === "regional");
  const countryLabel = country === "MY" ? "Malaysia" : "Indonesia";

  // Group regional holidays by date and name for sidebar
  const groupedRegional: Array<HolidayData & { regions: string[] }> = [];
  for (const h of regional) {
    const dStr = new Date(h.date).toISOString().slice(0, 10);
    const existing = groupedRegional.find(
      (item) =>
        new Date(item.date).toISOString().slice(0, 10) === dStr &&
        item.name === h.name
    );
    if (existing) {
      if (h.regionCode) existing.regions.push(h.regionCode);
    } else {
      groupedRegional.push({
        ...h,
        regions: h.regionCode ? [h.regionCode] : [],
      });
    }
  }

  return (
    <Document title={`Kalender ${monthName} ${year} — ${countryLabel}`} author="Kalend">
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>{monthName} {year}</Text>
            <Text style={styles.subtitle}>Kalend · {countryLabel}</Text>
          </View>
          <View>
            <Text style={styles.subtitle}>kalend.id</Text>
          </View>
        </View>

        <View style={styles.gridContainer}>
          {/* Calendar grid */}
          <View style={styles.calGrid}>
            {/* Day headers */}
            <View style={styles.dayHeaderRow}>
              {DAY_LABELS.map((d) => (
                <Text key={d} style={styles.dayHeader}>{d}</Text>
              ))}
            </View>

            {/* Weeks */}
            {weeks.map((week, wi) => (
              <View key={wi} style={styles.weekRow}>
                {week.map((cell, ci) => {
                  if (!cell.day) {
                    return <View key={ci} style={styles.cellEmpty} />;
                  }
                  const dayHolidays = getHolidayForDay(holidays, year, month, cell.day);
                  const isHoliday = dayHolidays.some((h) => h.type === "national");
                  const isJoint = dayHolidays.some((h) => h.type === "joint-leave");
                  const isRegional = dayHolidays.some((h) => h.type === "regional");

                  const holiday = dayHolidays.find((h) => h.type === "national");
                  const jointHol = dayHolidays.find((h) => h.type === "joint-leave");
                  
                  const regionalHols = dayHolidays.filter((h) => h.type === "regional");
                  const groupedRegionalHols = regionalHols.reduce((acc, h) => {
                    const existing = acc.find((x) => x.name === h.name);
                    if (existing) {
                      if (h.regionCode) existing.regions.push(h.regionCode);
                    } else {
                      acc.push({ ...h, regions: h.regionCode ? [h.regionCode] : [] });
                    }
                    return acc;
                  }, [] as Array<HolidayData & { regions: string[] }>);

                  return (
                    <View key={ci} style={[styles.cell, cell.isWeekend ? styles.cellWeekend : {}]}>
                      <Text style={[
                        styles.dayNum,
                        isHoliday ? styles.dayNumHoliday : isJoint ? styles.dayNumJoint : isRegional ? styles.dayNumRegional : {}
                      ]}>
                        {cell.day}
                      </Text>
                      {holiday && <Text style={styles.holidayName}>{holiday.name.slice(0, 28)}</Text>}
                      {jointHol && <Text style={styles.jointName}>{jointHol.name.slice(0, 28)}</Text>}
                      {groupedRegionalHols.map((reg, idx) => {
                        return (
                          <Text key={idx} style={styles.regionalName}>
                            {reg.name.slice(0, 28)}
                          </Text>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            ))}

            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: RED }]} />
                <Text style={styles.legendLabel}>Hari Libur Nasional</Text>
              </View>
              {holidays.some((h) => h.type === "joint-leave") && (
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: ORANGE }]} />
                  <Text style={styles.legendLabel}>Cuti Bersama</Text>
                </View>
              )}
              {holidays.some((h) => h.type === "regional") && (
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: EMERALD }]} />
                  <Text style={styles.legendLabel}>Libur Daerah</Text>
                </View>
              )}
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: GRAY_BG, border: `1px solid ${HAIRLINE}` }]} />
                <Text style={styles.legendLabel}>Akhir Pekan</Text>
              </View>
            </View>
          </View>

          {/* Sidebar */}
          <View style={styles.sidebar}>
            {national.length > 0 && (
              <>
                <Text style={styles.sidebarTitle}>Hari Libur Nasional</Text>
                {national.map((h) => {
                  const d = new Date(h.date);
                  return (
                    <View key={h.id} style={styles.holidayItem}>
                      <Text style={styles.holidayDate}>{d.getDate()} {MONTH_NAMES_ID[d.getMonth()]}</Text>
                      <Text style={styles.holidayItemName}>{h.name}</Text>
                    </View>
                  );
                })}
              </>
            )}

            {joint.length > 0 && (
              <>
                <Text style={[styles.sidebarTitle, { marginTop: 14 }]}>Cuti Bersama</Text>
                {joint.map((h) => {
                  const d = new Date(h.date);
                  return (
                    <View key={h.id} style={styles.holidayItem}>
                      <Text style={styles.holidayDate}>{d.getDate()} {MONTH_NAMES_ID[d.getMonth()]}</Text>
                      <Text style={styles.holidayItemName}>{h.name}</Text>
                    </View>
                  );
                })}
              </>
            )}

            {groupedRegional.length > 0 && (
              <>
                <Text style={[styles.sidebarTitle, { marginTop: 14 }]}>Libur Daerah</Text>
                {groupedRegional.map((h) => {
                  const d = new Date(h.date);
                  const regionsStr = h.regions.length > 0 ? ` (${h.regions.join(", ")})` : "";
                  return (
                    <View key={h.id} style={styles.holidayItem}>
                      <Text style={styles.holidayDate}>{d.getDate()} {MONTH_NAMES_ID[d.getMonth()]}</Text>
                      <Text style={styles.holidayItemName}>{h.name}{regionsStr}</Text>
                    </View>
                  );
                })}
              </>
            )}

            {national.length === 0 && joint.length === 0 && groupedRegional.length === 0 && (
              <Text style={{ fontSize: 8, color: MUTED }}>Tidak ada hari libur bulan ini.</Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

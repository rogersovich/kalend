import { describe, it, expect } from "vitest";
import { calculateWeton, isValidWetonDate } from "./weton";

// Verified via anchor: 2024-02-14 = Rabu Pahing (Indonesian election day — widely documented)
// Anchor: 1900-01-01 = Senin Pon (ANCHOR_PASARAN_INDEX=2)
const testCases = [
  { date: "1900-01-01", hari: "Senin", pasaran: "Pon", neptu: 11 },
  { date: "2000-01-01", hari: "Sabtu", pasaran: "Pahing", neptu: 18 },
  { date: "1945-08-17", hari: "Jumat", pasaran: "Pahing", neptu: 15 },
  { date: "2026-01-01", hari: "Kamis", pasaran: "Wage", neptu: 12 },
  { date: "2025-12-25", hari: "Kamis", pasaran: "Pahing", neptu: 17 },
  { date: "2025-08-17", hari: "Minggu", pasaran: "Pahing", neptu: 14 },
  { date: "2024-01-01", hari: "Senin", pasaran: "Pon", neptu: 11 },
  { date: "2000-02-29", hari: "Selasa", pasaran: "Legi", neptu: 8 },
  { date: "2025-12-31", hari: "Rabu", pasaran: "Pon", neptu: 14 },
  { date: "2026-06-01", hari: "Senin", pasaran: "Kliwon", neptu: 12 },
];

describe("calculateWeton", () => {
  for (const tc of testCases) {
    it(`${tc.date} = ${tc.hari} ${tc.pasaran} (neptu ${tc.neptu})`, () => {
      const [y, m, d] = tc.date.split("-").map(Number);
      const date = new Date(y, m - 1, d);
      const result = calculateWeton(date);
      expect(result.hari).toBe(tc.hari);
      expect(result.pasaran).toBe(tc.pasaran);
      expect(result.neptuTotal).toBe(tc.neptu);
    });
  }
});

describe("isValidWetonDate", () => {
  it("accepts 1900-01-01", () => {
    expect(isValidWetonDate(new Date(1900, 0, 1))).toBe(true);
  });
  it("accepts 2100-12-31", () => {
    expect(isValidWetonDate(new Date(2100, 11, 31))).toBe(true);
  });
  it("rejects 1899-12-31", () => {
    expect(isValidWetonDate(new Date(1899, 11, 31))).toBe(false);
  });
  it("rejects 2101-01-01", () => {
    expect(isValidWetonDate(new Date(2101, 0, 1))).toBe(false);
  });
});

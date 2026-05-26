export const MONTH_NAMES_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export const DAY_NAMES_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
export const DAY_NAMES_FULL_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
export const DAY_NAMES_FULL_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const COUNTRIES = [
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
] as const;

export type CountryCode = "ID" | "MY";

// Shio (Chinese zodiac) for years — based on Chinese New Year cycle
// Cycle: Tikus, Kerbau, Macan, Kelinci, Naga, Ular, Kuda, Kambing, Monyet, Ayam, Anjing, Babi
const SHIO_CYCLE = [
  "Tikus", "Kerbau", "Macan", "Kelinci", "Naga", "Ular",
  "Kuda", "Kambing", "Monyet", "Ayam", "Anjing", "Babi",
];

// Base: 2020 = Tikus (index 0)
export function getShio(year: number): string {
  const idx = ((year - 2020) % 12 + 12) % 12;
  return SHIO_CYCLE[idx];
}

// Rough Hijri year mapping (approximate for display)
const HIJRI_MAP: Record<number, string> = {
  2020: "1441–1442 H", 2021: "1442–1443 H", 2022: "1443–1444 H",
  2023: "1444–1445 H", 2024: "1445–1446 H", 2025: "1446–1447 H",
  2026: "1447–1448 H", 2027: "1448–1449 H", 2028: "1449–1450 H",
  2029: "1450–1451 H", 2030: "1451–1452 H",
};

export function getHijriYears(year: number): string {
  return HIJRI_MAP[year] ?? `${year + 578}–${year + 579} H`;
}

export const MIN_YEAR = 2020;
export const MAX_YEAR = 2030;

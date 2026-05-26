// Anchor: 1 January 1900 = Senin Pon (verified via 2024-02-14 = Rabu Pahing)
// PRD says "Minggu Wage" but actual Gregorian day was Monday (Senin) and pasaran is Pon
// ANCHOR_PASARAN_INDEX = 2 (Pon in [Legi, Pahing, Pon, Wage, Kliwon])

const PASARAN = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"] as const;
const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;

export type Pasaran = (typeof PASARAN)[number];
export type Hari = (typeof HARI)[number];

// Neptu values
const NEPTU_HARI: Record<Hari, number> = {
  Minggu: 5,
  Senin: 4,
  Selasa: 3,
  Rabu: 7,
  Kamis: 8,
  Jumat: 6,
  Sabtu: 9,
};

const NEPTU_PASARAN: Record<Pasaran, number> = {
  Legi: 5,
  Pahing: 9,
  Pon: 7,
  Wage: 4,
  Kliwon: 8,
};

// Anchor: 1 Jan 1900 = Minggu Wage
// Wage index in PASARAN = 3
const ANCHOR_DATE = new Date("1900-01-01");
const ANCHOR_PASARAN_INDEX = 2; // Pon

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 86400000;
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((utcB - utcA) / msPerDay);
}

export interface WetonResult {
  hari: Hari;
  pasaran: Pasaran;
  weton: string;
  neptuHari: number;
  neptuPasaran: number;
  neptuTotal: number;
  makna: string;
}

export function calculateWeton(date: Date): WetonResult {
  const totalDays = daysBetween(ANCHOR_DATE, date);
  const pasaranIndex = ((ANCHOR_PASARAN_INDEX + totalDays) % 5 + 5) % 5;
  const pasaran = PASARAN[pasaranIndex];

  const dayIndex = date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  const hari = HARI[dayIndex];

  const neptuHari = NEPTU_HARI[hari];
  const neptuPasaran = NEPTU_PASARAN[pasaran];
  const neptuTotal = neptuHari + neptuPasaran;

  return {
    hari,
    pasaran,
    weton: `${hari} ${pasaran}`,
    neptuHari,
    neptuPasaran,
    neptuTotal,
    makna: getMakna(hari, pasaran, neptuTotal),
  };
}

function getMakna(hari: Hari, pasaran: Pasaran, neptu: number): string {
  // Simplified weton meanings based on neptu total
  if (neptu >= 17) {
    return "Weton dengan neptu tinggi. Dipercaya memiliki wibawa, tekad kuat, dan cocok untuk pemimpin. Namun perlu menjaga kesabaran.";
  }
  if (neptu >= 14) {
    return "Weton dengan neptu sedang-tinggi. Umumnya dikenal pekerja keras, bertanggung jawab, dan dihormati orang-orang sekitarnya.";
  }
  if (neptu >= 11) {
    return "Weton dengan neptu sedang. Memiliki sifat yang seimbang antara sosial dan mandiri. Mudah beradaptasi dan fleksibel.";
  }
  if (neptu >= 8) {
    return "Weton dengan neptu rendah-sedang. Dikenal sederhana, rendah hati, dan mudah bergaul. Cocok bekerja sama dalam tim.";
  }
  return "Weton dengan neptu rendah. Dipercaya memiliki sifat sabar, penurut, dan tidak suka konflik.";
}

export function isValidWetonDate(date: Date): boolean {
  const minDate = new Date("1900-01-01");
  const maxDate = new Date("2100-12-31");
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  return d >= minDate && d <= maxDate;
}

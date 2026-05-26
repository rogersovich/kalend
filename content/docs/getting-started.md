# Getting Started

Kalend API menyediakan akses programatik ke data hari libur Indonesia dan Malaysia, kalkulasi hari kerja, long weekend, dan informasi kalender lainnya.

## Autentikasi

Semua endpoint API memerlukan API key. Buat API key di [dashboard Kalend](https://kalend.id/dashboard/api-keys).

Kirim API key di setiap request melalui header `Authorization`:

```http
Authorization: Bearer kld_your_api_key_here
```

## Rate Limiting

Setiap API key dibatasi **100 request per hari**. Setiap respons menyertakan header:

| Header | Deskripsi |
|---|---|
| `X-RateLimit-Limit` | Batas harian (100) |
| `X-RateLimit-Remaining` | Sisa request hari ini |

Jika limit terlampaui, API mengembalikan `429 Too Many Requests`:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again tomorrow."
  }
}
```

## Format Respons

Semua respons menggunakan format JSON yang konsisten:

**Sukses:**
```json
{
  "success": true,
  "data": { ... },
  "meta": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Deskripsi error"
  }
}
```

## Quick Start

### 1. Buat API Key

Daftar akun di [kalend.id](https://kalend.id/register) lalu buka [dashboard API Keys](https://kalend.id/dashboard/api-keys) dan klik **Generate New Key**.

### 2. Test dengan cURL

```bash
curl -H "Authorization: Bearer kld_your_key" \
  "https://kalend.id/api/v1/holidays?country=ID&year=2026"
```

### 3. Integrasi JavaScript

```javascript
const API_KEY = "kld_your_key";
const BASE = "https://kalend.id/api/v1";

async function getHolidays(year, month) {
  const res = await fetch(
    `${BASE}/holidays?country=ID&year=${year}&month=${month}`,
    { headers: { Authorization: `Bearer ${API_KEY}` } }
  );
  const { data } = await res.json();
  return data;
}

// Ambil hari libur Januari 2026
const holidays = await getHolidays(2026, 1);
console.log(holidays);
```

### 4. Integrasi Next.js

```typescript
// lib/kalend.ts
const KALEND_API_KEY = process.env.KALEND_API_KEY!;
const BASE_URL = "https://kalend.id/api/v1";

export async function isHoliday(date: string, country = "ID") {
  const res = await fetch(
    `${BASE_URL}/check?date=${date}&country=${country}`,
    {
      headers: { Authorization: `Bearer ${KALEND_API_KEY}` },
      next: { revalidate: 86400 }, // cache 24 jam
    }
  );
  const { data } = await res.json();
  return data.isHoliday as boolean;
}
```

## Error Codes

| Code | HTTP Status | Deskripsi |
|---|---|---|
| `UNAUTHORIZED` | 401 | API key tidak valid atau tidak dikirim |
| `RATE_LIMIT_EXCEEDED` | 429 | Melebihi batas 100 req/hari |
| `INVALID_PARAMS` | 400 | Parameter tidak valid atau wajib kosong |
| `NOT_FOUND` | 404 | Resource tidak ditemukan |
| `INTERNAL_ERROR` | 500 | Server error |

## Dukungan

- Email: support@kalend.id
- Dokumentasi lengkap: [kalend.id/docs](https://kalend.id/docs)

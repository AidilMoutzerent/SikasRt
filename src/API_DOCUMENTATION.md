# API Documentation - Sistem Informasi Warga RT

## Base URL
```
Production: https://[your-project].supabase.co/functions/v1/server
Development: http://localhost:54321/functions/v1/server
```

## Authentication

Semua endpoint (kecuali auth endpoints) memerlukan JWT token di header:

```
Authorization: Bearer <your-jwt-token>
```

Token didapat dari Supabase Auth setelah login.

---

## Authentication Endpoints

### POST /api/auth/register
Register user baru (Admin atau Warga).

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123",
  "nama": "John Doe",
  "role": "admin", // "admin" | "warga"
  "telepon": "08123456789",
  // Untuk Warga:
  "blok": "A",
  "nomor_rumah": "01",
  // Untuk Admin:
  "jabatan": "Ketua RT",
  "nomor_rekening_bri": "1234567890",
  "nama_pemilik_rekening": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user_id": "uuid",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "jwt-token",
    "user": {
      "id": "uuid",
      "email": "admin@example.com",
      "role": "admin",
      "nama": "John Doe"
    }
  }
}
```

### POST /api/auth/logout
Logout user.

**Response:**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

## Warga Endpoints

### GET /api/warga
Get semua warga (Admin only).

**Query Parameters:**
- `search` (optional): Search by nama/blok/nomor_rumah
- `blok` (optional): Filter by blok
- `status` (optional): Filter by is_active

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nama": "John Doe",
      "email": "warga@example.com",
      "blok": "A",
      "nomor_rumah": "01",
      "telepon": "08123456789",
      "is_active": true,
      "created_at": "2025-11-13T00:00:00Z"
    }
  ],
  "total": 0,
  "page": 1,
  "limit": 50
}
```

### GET /api/warga/:id
Get detail warga.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "nama": "John Doe",
    "email": "warga@example.com",
    "blok": "A",
    "nomor_rumah": "01",
    "telepon": "08123456789",
    "nik": "1234567890123456",
    "no_kk": "1234567890123456",
    "alamat_lengkap": "Jl. Contoh No. 1",
    "jumlah_penghuni": 4,
    "status_kepemilikan": "milik_sendiri",
    "is_active": true
  }
}
```

### POST /api/warga
Tambah warga baru (Admin only).

**Request Body:**
```json
{
  "nama": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "blok": "B",
  "nomor_rumah": "05",
  "telepon": "08198765432",
  "nik": "1234567890123456",
  "no_kk": "1234567890123456"
}
```

### PUT /api/warga/:id
Update data warga.

### DELETE /api/warga/:id
Hapus/nonaktifkan warga (Admin only).

---

## Iuran Endpoints

### GET /api/iuran
Get semua iuran (Admin) atau iuran sendiri (Warga).

**Query Parameters:**
- `bulan` (optional): Filter by bulan (1-12)
- `tahun` (optional): Filter by tahun
- `status` (optional): Filter by status (belum_lunas/lunas)
- `warga_id` (optional): Filter by warga (Admin only)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "warga_id": "uuid",
      "warga_nama": "John Doe",
      "blok": "A",
      "nomor_rumah": "01",
      "bulan": 11,
      "tahun": 2025,
      "nominal": 25000,
      "denda": 0,
      "status": "belum_lunas",
      "tanggal_jatuh_tempo": "2025-11-10",
      "created_at": "2025-11-01T00:00:00Z"
    }
  ],
  "total": 0
}
```

### POST /api/iuran
Buat tagihan iuran (Admin only).

**Request Body:**
```json
{
  "bulan": 11,
  "tahun": 2025,
  "nominal": 25000,
  "tanggal_jatuh_tempo": "2025-11-10",
  "warga_ids": ["uuid1", "uuid2"], // Optional, jika kosong = semua warga
  "keterangan": "Iuran November 2025"
}
```

### POST /api/iuran/bulk
Buat tagihan massal untuk semua warga (Admin only).

**Request Body:**
```json
{
  "bulan": 11,
  "tahun": 2025,
  "nominal": 25000,
  "tanggal_jatuh_tempo": "2025-11-10"
}
```

---

## Pembayaran Iuran Endpoints

### POST /api/pembayaran
Bayar iuran (Warga) - **Transfer BRI only**.

**Request Body:**
```json
{
  "iuran_id": "uuid",
  "jumlah_bayar": 25000,
  "metode_pembayaran": "transfer_bri",
  "nomor_referensi": "BRI20251113001",
  "bukti_transfer": "https://...", // Optional: URL file upload
  "catatan": "Sudah transfer via BRI Mobile"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pembayaran berhasil dicatat. Menunggu verifikasi admin.",
  "data": {
    "id": "uuid",
    "status": "pending",
    "rekening_tujuan": {
      "bank": "BRI",
      "nomor_rekening": "1234567890",
      "nama_pemilik": "RT 05 - John Doe"
    }
  }
}
```

### GET /api/pembayaran
Get semua pembayaran (Admin) atau pembayaran sendiri (Warga).

**Query Parameters:**
- `status` (optional): pending/verified/rejected
- `warga_id` (optional): Admin only

### POST /api/pembayaran/:id/verify
Verifikasi pembayaran (Admin only).

**Request Body:**
```json
{
  "status": "verified", // "verified" | "rejected"
  "catatan": "Pembayaran valid, sesuai dengan mutasi rekening"
}
```

---

## Bank Sampah Endpoints

### GET /api/jenis-sampah
Get daftar jenis sampah dan harga.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nama": "Kardus",
      "harga_per_kg": 1500,
      "satuan": "kg",
      "deskripsi": "Kardus bekas",
      "is_active": true
    }
  ]
}
```

### POST /api/jenis-sampah
Tambah jenis sampah (Admin only).

**Request Body:**
```json
{
  "nama": "Kardus",
  "harga_per_kg": 1500,
  "satuan": "kg",
  "deskripsi": "Kardus bekas"
}
```

### PUT /api/jenis-sampah/:id
Update jenis sampah (Admin only).

### DELETE /api/jenis-sampah/:id
Hapus jenis sampah (Admin only).

### POST /api/setoran-sampah
Input setoran sampah (Petugas only).

**Request Body:**
```json
{
  "warga_id": "uuid",
  "tanggal_setor": "2025-11-13",
  "items": [
    {
      "jenis_sampah_id": "uuid",
      "berat": 5.5,
      "harga_per_kg": 1500
    },
    {
      "jenis_sampah_id": "uuid2",
      "berat": 3.0,
      "harga_per_kg": 1000
    }
  ],
  "catatan": "Setoran rutin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Setoran berhasil dicatat",
  "data": {
    "id": "uuid",
    "total_berat": 8.5,
    "total_nilai": 11250,
    "saldo_baru": 11250
  }
}
```

### GET /api/setoran-sampah
Get riwayat setoran (filtered by role).

**Query Parameters:**
- `warga_id` (optional)
- `start_date` (optional)
- `end_date` (optional)

### GET /api/saldo-bank-sampah
Get saldo bank sampah warga.

**Response (Warga):**
```json
{
  "success": true,
  "data": {
    "saldo": 0,
    "total_setoran": 0,
    "total_penarikan": 0
  }
}
```

**Response (Admin - All warga):**
```json
{
  "success": true,
  "data": [
    {
      "warga_id": "uuid",
      "nama": "John Doe",
      "saldo": 0,
      "total_setoran": 0,
      "total_penarikan": 0
    }
  ],
  "total_saldo_keseluruhan": 0
}
```

### POST /api/penarikan-saldo
Ajukan penarikan saldo (Warga).

**Request Body:**
```json
{
  "jumlah": 50000,
  "keperluan": "Bayar Iuran", // "tunai" | "bayar_iuran" | "transfer"
  "metode": "bayar_iuran",
  "catatan": "Gunakan untuk bayar iuran November"
}
```

### POST /api/penarikan-saldo/:id/approve
Approve penarikan saldo (Admin only).

**Request Body:**
```json
{
  "status": "approved", // "approved" | "rejected"
  "catatan": "Disetujui"
}
```

---

## Jadwal & Kegiatan Endpoints

### GET /api/jadwal-pengangkutan
Get jadwal pengangkutan sampah.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "hari": "rabu",
      "waktu_mulai": "07:00",
      "waktu_selesai": "09:00",
      "jenis_sampah": "organik",
      "lokasi": "Area RT 05",
      "is_active": true
    }
  ]
}
```

### POST /api/jadwal-pengangkutan
Tambah jadwal pengangkutan (Admin only).

### GET /api/kegiatan-rt
Get daftar kegiatan RT.

**Query Parameters:**
- `status` (optional): dijadwalkan/berlangsung/selesai/dibatalkan
- `start_date` (optional)
- `end_date` (optional)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nama": "Kerja Bakti RT",
      "deskripsi": "Kerja bakti membersihkan lingkungan",
      "tanggal": "2025-11-10",
      "waktu_mulai": "06:00",
      "waktu_selesai": "08:00",
      "lokasi": "Area RT 05",
      "kategori": "wajib",
      "peserta_target": "semua_warga",
      "status": "dijadwalkan"
    }
  ]
}
```

### POST /api/kegiatan-rt
Tambah kegiatan RT (Admin only).

---

## Informasi RT Endpoints

### GET /api/pengumuman
Get pengumuman RT.

**Query Parameters:**
- `kategori` (optional): umum/kegiatan/iuran/bank_sampah/penting
- `is_pinned` (optional): true/false

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "judul": "Kerja Bakti Minggu Ini",
      "isi": "Kerja bakti akan diadakan...",
      "kategori": "kegiatan",
      "prioritas": "tinggi",
      "is_pinned": true,
      "tanggal_publikasi": "2025-11-05T00:00:00Z",
      "created_by_nama": "Admin RT"
    }
  ]
}
```

### POST /api/pengumuman
Buat pengumuman (Admin only).

**Request Body:**
```json
{
  "judul": "Kerja Bakti Minggu Ini",
  "isi": "Kerja bakti akan diadakan pada hari Minggu...",
  "kategori": "kegiatan",
  "prioritas": "tinggi",
  "is_pinned": true,
  "tanggal_kadaluarsa": "2025-11-10"
}
```

### GET /api/kontak-pengurus
Get kontak pengurus RT.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "jabatan": "Ketua RT",
      "nama": "Pak Bambang",
      "telepon": "08123456789",
      "email": "ketua@rt05.com",
      "is_active": true
    }
  ]
}
```

### POST /api/kontak-pengurus
Tambah kontak pengurus (Admin only).

### GET /api/peraturan-rt
Get peraturan RT.

### POST /api/peraturan-rt
Tambah peraturan RT (Admin only).

### GET /api/informasi-rt
Get informasi umum RT.

**Response:**
```json
{
  "success": true,
  "data": {
    "nama_rt": "RT 05",
    "nama_rw": "RW 02",
    "kelurahan": "Mekar Sari",
    "kecamatan": "Kecamatan Contoh",
    "kota": "Kota Contoh",
    "ketua_rt": "Pak Bambang",
    "periode_mulai": 2023,
    "periode_selesai": 2026,
    "jumlah_kk": 0,
    "jumlah_jiwa": 0,
    "logo_url": null
  }
}
```

### PUT /api/informasi-rt
Update informasi RT (Admin only).

---

## Petugas Endpoints

### GET /api/petugas
Get daftar petugas bank sampah (Admin only).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nama": "Petugas 1",
      "email": "petugas@rt05.com",
      "telepon": "08123456789",
      "shift": "pagi",
      "wilayah_tanggungan": ["A", "B"],
      "is_active": true
    }
  ]
}
```

### POST /api/petugas
Tambah petugas bank sampah (Admin only).

**Request Body:**
```json
{
  "nama": "Petugas 1",
  "email": "petugas@rt05.com",
  "password": "password123",
  "telepon": "08123456789",
  "shift": "pagi",
  "wilayah_tanggungan": ["A", "B"]
}
```

---

## Laporan Endpoints

### GET /api/laporan/iuran
Get laporan iuran (Admin only).

**Query Parameters:**
- `bulan` (required)
- `tahun` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "periode": "November 2025",
    "total_warga": 0,
    "total_tagihan": 0,
    "total_lunas": 0,
    "total_belum_lunas": 0,
    "persentase_lunas": 0,
    "total_pendapatan": 0,
    "total_denda": 0,
    "detail": []
  }
}
```

### GET /api/laporan/bank-sampah
Get laporan bank sampah (Admin only).

**Query Parameters:**
- `start_date` (required)
- `end_date` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "periode": "1 Nov - 13 Nov 2025",
    "total_setoran": 0,
    "total_penarikan": 0,
    "total_saldo": 0,
    "total_transaksi": 0,
    "jenis_sampah_terbanyak": [],
    "warga_teraktif": [],
    "detail": []
  }
}
```

### GET /api/laporan/keuangan
Get laporan keuangan lengkap (Admin only).

**Query Parameters:**
- `start_date` (required)
- `end_date` (required)

---

## Dashboard Endpoints

### GET /api/dashboard/admin
Get dashboard data untuk admin.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_warga": 0,
    "total_warga_aktif": 0,
    "iuran_bulan_ini": {
      "total_tagihan": 0,
      "total_lunas": 0,
      "total_belum_lunas": 0,
      "persentase_lunas": 0,
      "total_pendapatan": 0
    },
    "bank_sampah": {
      "total_saldo": 0,
      "total_setoran_bulan_ini": 0,
      "total_transaksi_bulan_ini": 0
    },
    "aktivitas_terbaru": [],
    "chart_data": {
      "iuran_6_bulan": []
    }
  }
}
```

### GET /api/dashboard/warga
Get dashboard data untuk warga.

**Response:**
```json
{
  "success": true,
  "data": {
    "iuran_bulan_ini": {
      "id": null,
      "bulan": 11,
      "tahun": 2025,
      "nominal": 0,
      "status": null,
      "tanggal_jatuh_tempo": null
    },
    "saldo_bank_sampah": {
      "saldo": 0,
      "total_setoran": 0,
      "total_penarikan": 0
    },
    "jadwal_terdekat": [],
    "pengumuman_terbaru": []
  }
}
```

### GET /api/dashboard/petugas
Get dashboard data untuk petugas.

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "field": "email",
    "message": "Email tidak valid"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Token tidak valid atau sudah kadaluarsa"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Forbidden",
  "message": "Anda tidak memiliki akses ke resource ini"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Resource tidak ditemukan"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "Terjadi kesalahan pada server"
}
```

---

## Notes

- **Semua endpoint menggunakan JSON** untuk request dan response
- **Tanggal format**: ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
- **Pagination**: Default limit = 50, bisa diatur via query parameter
- **File upload**: Menggunakan Supabase Storage, return URL
- **Pembayaran**: Hanya **Transfer BRI**, tidak ada metode lain

## Metode Pembayaran - Bank BRI Only

### Flow Pembayaran Iuran

1. **Warga melihat tagihan** via `GET /api/iuran`
2. **Warga klik bayar** - sistem return info rekening BRI RT
3. **Warga transfer** via BRI Mobile/ATM/Internet Banking
4. **Warga konfirmasi** via `POST /api/pembayaran` dengan nomor referensi
5. **Admin verifikasi** via `POST /api/pembayaran/:id/verify`
6. **Status berubah** menjadi "Lunas"

### Informasi Rekening BRI

Rekening BRI RT didapat dari data admin yang diinput saat registrasi:
- Nomor Rekening BRI
- Nama Pemilik Rekening
- Bank: BRI

---

**API Documentation v1.0.0** - Sistem Informasi Warga RT

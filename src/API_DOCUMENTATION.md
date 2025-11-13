# API Documentation - Sistem Informasi Warga RT

Backend API untuk aplikasi Sistem Informasi Warga RT menggunakan Supabase Edge Functions dengan Hono framework.

## Base URL

```
https://{projectId}.supabase.co/functions/v1/make-server-784cdc32
```

## Authentication

Sebagian besar endpoint memerlukan autentikasi. Gunakan Bearer token di header:

```
Authorization: Bearer {accessToken}
```

Token didapatkan dari endpoint `/auth/login` atau `/auth/register`.

---

## 1. Authentication Endpoints

### 1.1 Register User

**POST** `/auth/register`

Mendaftarkan user baru (Warga atau Admin).

**Request Body:**
```json
{
  "role": "warga",  // "warga" atau "admin"
  "namaLengkap": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  // Untuk Warga (wajib):
  "nomorRumah": "12",
  "blok": "A",
  "noTelepon": "081234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "userId": "uuid-here",
  "role": "warga"
}
```

### 1.2 Login

**POST** `/auth/login`

Login user (Warga, Admin, atau Petugas).

**Request Body:**
```json
{
  "username": "johndoe",  // atau email
  "password": "password123",
  "role": "warga"  // "warga", "admin", atau "petugas"
}
```

**Response:**
```json
{
  "success": true,
  "accessToken": "jwt-token-here",
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com",
    "namaLengkap": "John Doe",
    "role": "warga",
    // Data tambahan sesuai role
    "nomorRumah": "12",
    "blok": "A",
    "noTelepon": "081234567890"
  }
}
```

### 1.3 Get Current User

**GET** `/auth/me`

Mendapatkan data user yang sedang login.

**Headers:** Requires Authentication

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com",
    "namaLengkap": "John Doe",
    "role": "warga",
    "nomorRumah": "12",
    "blok": "A"
  }
}
```

---

## 2. Warga Management (Admin Only)

### 2.1 Get All Warga

**GET** `/warga`

**Headers:** Requires Authentication (Admin only)

**Response:**
```json
{
  "warga": [
    {
      "id": "uuid",
      "userId": "uuid",
      "namaLengkap": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "nomorRumah": "12",
      "blok": "A",
      "noTelepon": "081234567890",
      "statusAktif": true,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2.2 Get Warga by ID

**GET** `/warga/:id`

**Headers:** Requires Authentication

### 2.3 Update Warga

**PUT** `/warga/:id`

**Headers:** Requires Authentication (Admin only)

**Request Body:**
```json
{
  "namaLengkap": "John Doe Updated",
  "noTelepon": "089999999999",
  "statusAktif": false
}
```

### 2.4 Delete Warga

**DELETE** `/warga/:id`

**Headers:** Requires Authentication (Admin only)

---

## 3. Iuran Management

### 3.1 Get Iuran by Warga

**GET** `/iuran/:wargaId`

**Headers:** Requires Authentication

**Response:**
```json
{
  "iuran": [
    {
      "id": "uuid",
      "wargaId": "uuid",
      "periode": "2025-01",
      "jumlah": 50000,
      "status": "lunas",
      "metodePembayaran": "QRIS",
      "buktiPembayaran": "url-to-image",
      "paidAt": "2025-01-05T10:00:00.000Z",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3.2 Get All Iuran (Admin Only)

**GET** `/iuran`

**Headers:** Requires Authentication (Admin only)

### 3.3 Create/Update Iuran

**POST** `/iuran`

**Headers:** Requires Authentication (Admin only)

**Request Body:**
```json
{
  "wargaId": "uuid",
  "periode": "2025-01",
  "jumlah": 50000,
  "status": "belum_bayar"
}
```

### 3.4 Update Iuran Status

**PUT** `/iuran/:wargaId/:periode`

**Headers:** Requires Authentication

**Request Body:**
```json
{
  "status": "lunas",
  "metodePembayaran": "QRIS",
  "buktiPembayaran": "base64-or-url"
}
```

---

## 4. Bank Sampah - Harga Sampah

### 4.1 Get All Harga Sampah

**GET** `/harga-sampah`

**Headers:** Requires Authentication

**Response:**
```json
{
  "hargaSampah": [
    {
      "id": "uuid",
      "jenisSampah": "Plastik PET",
      "kategori": "Plastik",
      "hargaPerKg": 3000,
      "satuan": "kg",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### 4.2 Create Harga Sampah

**POST** `/harga-sampah`

**Headers:** Requires Authentication (Admin only)

**Request Body:**
```json
{
  "jenisSampah": "Plastik PET",
  "kategori": "Plastik",
  "hargaPerKg": 3000,
  "satuan": "kg"
}
```

### 4.3 Update Harga Sampah

**PUT** `/harga-sampah/:id`

**Headers:** Requires Authentication (Admin only)

### 4.4 Delete Harga Sampah

**DELETE** `/harga-sampah/:id`

**Headers:** Requires Authentication (Admin only)

---

## 5. Bank Sampah - Setoran

### 5.1 Get All Setoran

**GET** `/setoran?wargaId=uuid`

**Headers:** Requires Authentication

**Query Parameters:**
- `wargaId` (optional): Filter by specific warga

**Response:**
```json
{
  "setoran": [
    {
      "id": "uuid",
      "wargaId": "uuid",
      "petugasId": "uuid",
      "items": [
        {
          "jenisSampah": "Plastik PET",
          "berat": 2.5,
          "hargaPerKg": 3000,
          "totalHarga": 7500
        }
      ],
      "totalBerat": 2.5,
      "totalHarga": 7500,
      "tanggal": "2025-01-10T10:00:00.000Z",
      "createdAt": "2025-01-10T10:00:00.000Z"
    }
  ]
}
```

### 5.2 Create Setoran

**POST** `/setoran`

**Headers:** Requires Authentication (Admin or Petugas only)

**Request Body:**
```json
{
  "wargaId": "uuid",
  "items": [
    {
      "jenisSampah": "Plastik PET",
      "berat": 2.5,
      "hargaPerKg": 3000,
      "totalHarga": 7500
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "setoran": { /* setoran data */ },
  "saldoBaru": 15000
}
```

### 5.3 Get Saldo Bank Sampah

**GET** `/saldo/:wargaId`

**Headers:** Requires Authentication

**Response:**
```json
{
  "saldo": {
    "wargaId": "uuid",
    "saldo": 15000,
    "lastUpdated": "2025-01-10T10:00:00.000Z"
  }
}
```

---

## 6. Jadwal Pengangkutan

### 6.1 Get All Jadwal

**GET** `/jadwal`

**Headers:** Requires Authentication

**Response:**
```json
{
  "jadwal": [
    {
      "id": "uuid",
      "hari": "Senin",
      "waktu": "07:00",
      "jenisSampah": "Organik",
      "blok": "A",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### 6.2 Create Jadwal

**POST** `/jadwal`

**Headers:** Requires Authentication (Admin only)

**Request Body:**
```json
{
  "hari": "Senin",
  "waktu": "07:00",
  "jenisSampah": "Organik",
  "blok": "A"
}
```

### 6.3 Update Jadwal

**PUT** `/jadwal/:id`

**Headers:** Requires Authentication (Admin only)

### 6.4 Delete Jadwal

**DELETE** `/jadwal/:id`

**Headers:** Requires Authentication (Admin only)

---

## 7. Informasi RT

### 7.1 Get All Informasi

**GET** `/informasi`

**Headers:** Requires Authentication

**Response:**
```json
{
  "informasi": [
    {
      "id": "uuid",
      "judul": "Pengumuman Rapat RT",
      "konten": "Rapat RT akan dilaksanakan pada...",
      "kategori": "Pengumuman",
      "prioritas": "tinggi",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### 7.2 Create Informasi

**POST** `/informasi`

**Headers:** Requires Authentication (Admin only)

**Request Body:**
```json
{
  "judul": "Pengumuman Rapat RT",
  "konten": "Rapat RT akan dilaksanakan pada...",
  "kategori": "Pengumuman",
  "prioritas": "tinggi"
}
```

### 7.3 Update Informasi

**PUT** `/informasi/:id`

**Headers:** Requires Authentication (Admin only)

### 7.4 Delete Informasi

**DELETE** `/informasi/:id`

**Headers:** Requires Authentication (Admin only)

---

## 8. Petugas Management (Admin Only)

### 8.1 Get All Petugas

**GET** `/petugas`

**Headers:** Requires Authentication (Admin only)

### 8.2 Create Petugas

**POST** `/petugas`

**Headers:** Requires Authentication (Admin only)

**Request Body:**
```json
{
  "namaLengkap": "Ahmad Petugas",
  "email": "ahmad@example.com",
  "username": "ahmadpetugas",
  "password": "password123",
  "noTelepon": "081234567890"
}
```

### 8.3 Update Petugas

**PUT** `/petugas/:id`

**Headers:** Requires Authentication (Admin only)

### 8.4 Delete Petugas

**DELETE** `/petugas/:id`

**Headers:** Requires Authentication (Admin only)

---

## 9. Dashboard Statistics

### 9.1 Get Dashboard Stats

**GET** `/dashboard/stats`

**Headers:** Requires Authentication

**Response (Admin):**
```json
{
  "stats": {
    "totalWarga": 50,
    "totalIuranLunas": 45,
    "totalIuranBelumBayar": 5,
    "totalPendapatanIuran": 2250000,
    "totalSetoranBulanIni": 500000,
    "periode": "2025-01"
  }
}
```

**Response (Warga):**
```json
{
  "stats": {
    "saldoBankSampah": 15000,
    "statusIuranBulanIni": "lunas",
    "jumlahIuranBulanIni": 50000,
    "totalSetoran": 5,
    "periode": "2025-01"
  }
}
```

**Response (Petugas):**
```json
{
  "stats": {
    "totalSetoranDiproses": 100,
    "totalSetoranBulanIni": 25,
    "totalBeratBulanIni": 125.5,
    "totalNilaiBulanIni": 375000,
    "periode": "2025-01"
  }
}
```

---

## Error Handling

Semua error response memiliki format:

```json
{
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (validasi gagal)
- `401`: Unauthorized (tidak terautentikasi)
- `403`: Forbidden (tidak memiliki akses)
- `404`: Not Found (data tidak ditemukan)
- `500`: Internal Server Error

---

## Data Structure

### User Roles
- `warga`: Warga RT
- `admin`: Admin/Pengurus RT
- `petugas`: Petugas Bank Sampah

### Status Iuran
- `belum_bayar`: Belum dibayar
- `lunas`: Sudah lunas
- `terlambat`: Terlambat bayar

### Metode Pembayaran
- `QRIS`
- `Transfer Bank`
- `Tunai`

### Kategori Sampah
- `Plastik`
- `Kertas`
- `Logam`
- `Kaca`
- `Elektronik`
- `Lainnya`

### Prioritas Informasi
- `tinggi`: Prioritas tinggi
- `normal`: Prioritas normal
- `rendah`: Prioritas rendah

---

## Notes

1. **Authentication**: Semua endpoint kecuali `/auth/register` dan `/auth/login` memerlukan autentikasi
2. **Authorization**: Endpoint dengan label "Admin only" atau "Petugas only" hanya bisa diakses oleh role tersebut
3. **Periode Format**: Periode iuran menggunakan format `YYYY-MM` (contoh: "2025-01")
4. **Auto-confirm Email**: Karena belum ada email server, semua registrasi otomatis dikonfirmasi
5. **Data Persistence**: Data disimpan di KV Store Supabase

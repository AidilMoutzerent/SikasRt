# Manual API Testing Guide

Panduan untuk testing API backend secara manual menggunakan curl atau Postman.

## Setup

Ganti `{PROJECT_ID}` dengan projectId Supabase Anda.

```bash
export API_URL="https://{PROJECT_ID}.supabase.co/functions/v1/make-server-784cdc32"
export ANON_KEY="{YOUR_ANON_KEY}"
```

---

## 1. Health Check

```bash
curl -X GET "$API_URL/health"
```

**Expected Response:**
```json
{
  "status": "ok"
}
```

---

## 2. Register Admin

```bash
curl -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{
    "role": "admin",
    "namaLengkap": "Admin RT 001",
    "email": "admin@rt001.com",
    "username": "admin",
    "password": "admin123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "userId": "uuid-here",
  "role": "admin"
}
```

---

## 3. Login Admin

```bash
curl -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "role": "admin"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "accessToken": "jwt-token-here",
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@rt001.com",
    "namaLengkap": "Admin RT 001",
    "role": "admin"
  }
}
```

**Save the access token:**
```bash
export ADMIN_TOKEN="jwt-token-from-response"
```

---

## 4. Register Warga

```bash
curl -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{
    "role": "warga",
    "namaLengkap": "Budi Santoso",
    "email": "budi@example.com",
    "username": "budi123",
    "password": "password123",
    "nomorRumah": "01",
    "blok": "A",
    "noTelepon": "081234567890"
  }'
```

---

## 5. Login Warga

```bash
curl -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{
    "username": "budi123",
    "password": "password123",
    "role": "warga"
  }'
```

**Save the warga token and ID:**
```bash
export WARGA_TOKEN="jwt-token-from-response"
export WARGA_ID="uuid-from-response"
```

---

## 6. Get Current User

```bash
curl -X GET "$API_URL/auth/me" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 7. Create Petugas (Admin Only)

```bash
curl -X POST "$API_URL/petugas" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "namaLengkap": "Andi Wijaya",
    "email": "andi@example.com",
    "username": "petugas",
    "password": "petugas123",
    "noTelepon": "081234567895"
  }'
```

**Save petugas ID:**
```bash
export PETUGAS_ID="uuid-from-response"
```

---

## 8. Login Petugas

```bash
curl -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{
    "username": "petugas",
    "password": "petugas123",
    "role": "petugas"
  }'
```

**Save petugas token:**
```bash
export PETUGAS_TOKEN="jwt-token-from-response"
```

---

## 9. Get All Warga (Admin Only)

```bash
curl -X GET "$API_URL/warga" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 10. Create Harga Sampah (Admin Only)

```bash
curl -X POST "$API_URL/harga-sampah" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "jenisSampah": "Plastik PET",
    "kategori": "Plastik",
    "hargaPerKg": 3000,
    "satuan": "kg"
  }'
```

**Save harga sampah ID:**
```bash
export HARGA_ID="uuid-from-response"
```

---

## 11. Get All Harga Sampah

```bash
curl -X GET "$API_URL/harga-sampah" \
  -H "Authorization: Bearer $WARGA_TOKEN"
```

---

## 12. Update Harga Sampah (Admin Only)

```bash
curl -X PUT "$API_URL/harga-sampah/$HARGA_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "hargaPerKg": 3500
  }'
```

---

## 13. Create Iuran (Admin Only)

```bash
curl -X POST "$API_URL/iuran" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "wargaId": "'"$WARGA_ID"'",
    "periode": "2025-01",
    "jumlah": 50000,
    "status": "belum_bayar"
  }'
```

---

## 14. Get Iuran by Warga

```bash
curl -X GET "$API_URL/iuran/$WARGA_ID" \
  -H "Authorization: Bearer $WARGA_TOKEN"
```

---

## 15. Update Iuran (Bayar)

```bash
curl -X PUT "$API_URL/iuran/$WARGA_ID/2025-01" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $WARGA_TOKEN" \
  -d '{
    "status": "lunas",
    "metodePembayaran": "QRIS",
    "buktiPembayaran": "https://example.com/bukti.jpg"
  }'
```

---

## 16. Create Setoran (Petugas Only)

```bash
curl -X POST "$API_URL/setoran" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PETUGAS_TOKEN" \
  -d '{
    "wargaId": "'"$WARGA_ID"'",
    "items": [
      {
        "jenisSampah": "Plastik PET",
        "berat": 2.5,
        "hargaPerKg": 3000,
        "totalHarga": 7500
      },
      {
        "jenisSampah": "Kardus",
        "berat": 5.0,
        "hargaPerKg": 1200,
        "totalHarga": 6000
      }
    ]
  }'
```

---

## 17. Get Setoran by Warga

```bash
curl -X GET "$API_URL/setoran?wargaId=$WARGA_ID" \
  -H "Authorization: Bearer $WARGA_TOKEN"
```

---

## 18. Get Saldo Bank Sampah

```bash
curl -X GET "$API_URL/saldo/$WARGA_ID" \
  -H "Authorization: Bearer $WARGA_TOKEN"
```

---

## 19. Create Jadwal (Admin Only)

```bash
curl -X POST "$API_URL/jadwal" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "hari": "Senin",
    "waktu": "07:00",
    "jenisSampah": "Sampah Organik",
    "blok": "Semua"
  }'
```

**Save jadwal ID:**
```bash
export JADWAL_ID="uuid-from-response"
```

---

## 20. Get All Jadwal

```bash
curl -X GET "$API_URL/jadwal" \
  -H "Authorization: Bearer $WARGA_TOKEN"
```

---

## 21. Create Informasi (Admin Only)

```bash
curl -X POST "$API_URL/informasi" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "judul": "Pengumuman Rapat RT",
    "konten": "Rapat RT akan dilaksanakan pada hari Minggu, 15 Januari 2025 pukul 09:00 WIB di Balai RT.",
    "kategori": "Pengumuman",
    "prioritas": "tinggi"
  }'
```

**Save informasi ID:**
```bash
export INFO_ID="uuid-from-response"
```

---

## 22. Get All Informasi

```bash
curl -X GET "$API_URL/informasi" \
  -H "Authorization: Bearer $WARGA_TOKEN"
```

---

## 23. Get Dashboard Stats (Admin)

```bash
curl -X GET "$API_URL/dashboard/stats" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 24. Get Dashboard Stats (Warga)

```bash
curl -X GET "$API_URL/dashboard/stats" \
  -H "Authorization: Bearer $WARGA_TOKEN"
```

---

## 25. Get Dashboard Stats (Petugas)

```bash
curl -X GET "$API_URL/dashboard/stats" \
  -H "Authorization: Bearer $PETUGAS_TOKEN"
```

---

## 26. Delete Harga Sampah (Admin Only)

```bash
curl -X DELETE "$API_URL/harga-sampah/$HARGA_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 27. Delete Jadwal (Admin Only)

```bash
curl -X DELETE "$API_URL/jadwal/$JADWAL_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 28. Delete Informasi (Admin Only)

```bash
curl -X DELETE "$API_URL/informasi/$INFO_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 29. Update Warga (Admin Only)

```bash
curl -X PUT "$API_URL/warga/$WARGA_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "noTelepon": "089999999999",
    "statusAktif": true
  }'
```

---

## 30. Delete Warga (Admin Only)

```bash
curl -X DELETE "$API_URL/warga/$WARGA_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## Testing Flow

### Complete Testing Flow:

1. ✅ Register Admin
2. ✅ Login Admin
3. ✅ Register 3-5 Warga
4. ✅ Create Petugas
5. ✅ Create Harga Sampah (minimal 5 jenis)
6. ✅ Create Jadwal (4 jadwal)
7. ✅ Create Informasi (3 informasi)
8. ✅ Create Iuran untuk semua warga
9. ✅ Login sebagai Petugas
10. ✅ Create Setoran untuk beberapa warga
11. ✅ Login sebagai Warga
12. ✅ Get Saldo Bank Sampah
13. ✅ Get Iuran
14. ✅ Update Iuran (bayar)
15. ✅ Get Dashboard Stats (semua role)

---

## Postman Collection

Jika menggunakan Postman, import collection berikut:

### Environment Variables:
```
api_url = https://{PROJECT_ID}.supabase.co/functions/v1/make-server-784cdc32
anon_key = {YOUR_ANON_KEY}
admin_token = (akan diisi setelah login)
warga_token = (akan diisi setelah login)
petugas_token = (akan diisi setelah login)
warga_id = (akan diisi setelah register warga)
```

### Pre-request Script untuk Authentication:
```javascript
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + (pm.environment.get('admin_token') || pm.environment.get('anon_key'))
});
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Semua field wajib diisi"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden: Admin only"
}
```

### 404 Not Found
```json
{
  "error": "Data tidak ditemukan"
}
```

### 500 Internal Server Error
```json
{
  "error": "Terjadi kesalahan server: ..."
}
```

---

## Notes

1. **Authorization**: Semua endpoints kecuali health check memerlukan Authorization header
2. **Bearer Token**: Gunakan access token dari login response untuk authenticated requests
3. **Periode Format**: Format periode untuk iuran adalah `YYYY-MM` (contoh: "2025-01")
4. **UUIDs**: Simpan UUID dari response untuk digunakan di request berikutnya
5. **Error Logging**: Check server logs jika ada error untuk detail lengkap

---

Selamat Testing! 🧪

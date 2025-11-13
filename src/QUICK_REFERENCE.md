# Quick Reference - Backend API

Cheat sheet untuk API endpoints yang paling sering digunakan.

## 🔗 Base URL

```
https://{projectId}.supabase.co/functions/v1/make-server-784cdc32
```

## 🔑 Authorization Header

```
Authorization: Bearer {accessToken}
```

---

## 🚀 Authentication

### Register Warga
```bash
POST /auth/register
{
  "role": "warga",
  "namaLengkap": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  "nomorRumah": "12",
  "blok": "A",
  "noTelepon": "081234567890"
}
```

### Register Admin
```bash
POST /auth/register
{
  "role": "admin",
  "namaLengkap": "Admin RT",
  "email": "admin@example.com",
  "username": "admin",
  "password": "admin123"
}
```

### Login
```bash
POST /auth/login
{
  "username": "johndoe",
  "password": "password123",
  "role": "warga"
}
→ Returns: { accessToken, user }
```

### Get Current User
```bash
GET /auth/me
→ Returns: { user }
```

---

## 👥 Warga (Admin Only)

```bash
GET /warga                          # List all
GET /warga/:id                      # Get by ID
PUT /warga/:id                      # Update
DELETE /warga/:id                   # Delete
```

---

## 💰 Iuran

```bash
GET /iuran                          # All iuran (Admin)
GET /iuran/:wargaId                 # By warga
POST /iuran                         # Create (Admin)
PUT /iuran/:wargaId/:periode        # Update/pay
```

**Create Iuran:**
```json
{
  "wargaId": "uuid",
  "periode": "2025-01",
  "jumlah": 50000,
  "status": "belum_bayar"
}
```

**Pay Iuran:**
```json
{
  "status": "lunas",
  "metodePembayaran": "QRIS",
  "buktiPembayaran": "url-or-base64"
}
```

---

## 🗑️ Harga Sampah

```bash
GET /harga-sampah                   # List all
POST /harga-sampah                  # Create (Admin)
PUT /harga-sampah/:id               # Update (Admin)
DELETE /harga-sampah/:id            # Delete (Admin)
```

**Create:**
```json
{
  "jenisSampah": "Plastik PET",
  "kategori": "Plastik",
  "hargaPerKg": 3000,
  "satuan": "kg"
}
```

---

## ♻️ Setoran

```bash
GET /setoran                        # All setoran
GET /setoran?wargaId=uuid           # By warga
POST /setoran                       # Create (Petugas)
GET /saldo/:wargaId                 # Get saldo
```

**Create Setoran:**
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

---

## 📅 Jadwal

```bash
GET /jadwal                         # List all
POST /jadwal                        # Create (Admin)
PUT /jadwal/:id                     # Update (Admin)
DELETE /jadwal/:id                  # Delete (Admin)
```

**Create:**
```json
{
  "hari": "Senin",
  "waktu": "07:00",
  "jenisSampah": "Sampah Organik",
  "blok": "Semua"
}
```

---

## 📢 Informasi RT

```bash
GET /informasi                      # List all
POST /informasi                     # Create (Admin)
PUT /informasi/:id                  # Update (Admin)
DELETE /informasi/:id               # Delete (Admin)
```

**Create:**
```json
{
  "judul": "Pengumuman Rapat",
  "konten": "Rapat RT akan dilaksanakan...",
  "kategori": "Pengumuman",
  "prioritas": "tinggi"
}
```

---

## 👷 Petugas (Admin Only)

```bash
GET /petugas                        # List all
POST /petugas                       # Create
PUT /petugas/:id                    # Update
DELETE /petugas/:id                 # Delete
```

**Create:**
```json
{
  "namaLengkap": "Andi Petugas",
  "email": "andi@example.com",
  "username": "petugas123",
  "password": "password123",
  "noTelepon": "081234567890"
}
```

---

## 📊 Dashboard Stats

```bash
GET /dashboard/stats
```

**Admin Response:**
```json
{
  "totalWarga": 50,
  "totalIuranLunas": 45,
  "totalIuranBelumBayar": 5,
  "totalPendapatanIuran": 2250000,
  "totalSetoranBulanIni": 500000,
  "periode": "2025-01"
}
```

**Warga Response:**
```json
{
  "saldoBankSampah": 15000,
  "statusIuranBulanIni": "lunas",
  "jumlahIuranBulanIni": 50000,
  "totalSetoran": 5,
  "periode": "2025-01"
}
```

---

## 🎣 React Hooks

### useAuth
```tsx
const { user, loading, isAuthenticated, login, logout, register } = useAuth();

await login('username', 'password', 'warga');
await register({ role, namaLengkap, email, ... });
logout();
```

### useWarga
```tsx
const { warga, loading, updateWarga, deleteWarga } = useWarga();

await updateWarga(id, { noTelepon: '08999999' });
await deleteWarga(id);
```

### useHargaSampah
```tsx
const { hargaSampah, createHargaSampah, updateHargaSampah, deleteHargaSampah } = useHargaSampah();

await createHargaSampah({ jenisSampah, kategori, hargaPerKg });
await updateHargaSampah(id, { hargaPerKg: 3500 });
await deleteHargaSampah(id);
```

### useDashboard
```tsx
const { stats, loading, fetchStats } = useDashboard();

// Stats automatically fetched
// Call fetchStats() to refresh
```

---

## 🔧 Direct API Calls

```tsx
import { iuranAPI, setoranAPI, jadwalAPI, informasiAPI } from './utils/api';

// Iuran
const { iuran } = await iuranAPI.getByWarga(wargaId);
await iuranAPI.create({ wargaId, periode, jumlah });
await iuranAPI.update(wargaId, periode, { status: 'lunas' });

// Setoran
const { setoran } = await setoranAPI.getAll(wargaId);
await setoranAPI.create({ wargaId, items });
const { saldo } = await setoranAPI.getSaldo(wargaId);

// Jadwal
const { jadwal } = await jadwalAPI.getAll();
await jadwalAPI.create({ hari, waktu, jenisSampah });

// Informasi
const { informasi } = await informasiAPI.getAll();
await informasiAPI.create({ judul, konten, kategori });
```

---

## ⚠️ Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request body |
| 401 | Unauthorized | Login required |
| 403 | Forbidden | Wrong role |
| 404 | Not Found | Check ID |
| 500 | Server Error | Check logs |

---

## 💡 Common Patterns

### Complete Login Flow
```tsx
const handleLogin = async () => {
  const { success } = await login(username, password, role);
  if (success) {
    // User automatically saved to localStorage
    // Access via useAuth().user
  }
};
```

### Complete Registration Flow
```tsx
const handleRegister = async () => {
  const { success } = await register({
    role: 'warga',
    namaLengkap,
    email,
    username,
    password,
    nomorRumah,
    blok,
    noTelepon,
  });
  
  if (success) {
    // Switch to login mode
    setIsRegisterMode(false);
  }
};
```

### Complete Setoran Flow
```tsx
const handleSubmitSetoran = async () => {
  const result = await setoranAPI.create({
    wargaId: selectedWarga,
    items: items.map(i => ({
      jenisSampah: i.jenis,
      berat: parseFloat(i.berat),
      hargaPerKg: parseFloat(i.harga),
      totalHarga: parseFloat(i.berat) * parseFloat(i.harga),
    })),
  });
  
  toast.success(`Saldo baru: Rp ${result.saldoBaru.toLocaleString()}`);
};
```

### Complete Payment Flow
```tsx
const handleBayarIuran = async (periode: string) => {
  await iuranAPI.update(user.id, periode, {
    status: 'lunas',
    metodePembayaran: 'QRIS',
    buktiPembayaran: uploadedImageUrl,
  });
  
  // Refresh iuran data
  const updated = await iuranAPI.getByWarga(user.id);
  setIuran(updated.iuran);
};
```

---

## 📋 Checklist Testing

- [ ] Register Admin ✓
- [ ] Login Admin ✓
- [ ] Create Petugas ✓
- [ ] Register Warga ✓
- [ ] Login Warga ✓
- [ ] Create Harga Sampah ✓
- [ ] Create Jadwal ✓
- [ ] Create Informasi ✓
- [ ] Create Iuran ✓
- [ ] Update Iuran (Bayar) ✓
- [ ] Login Petugas ✓
- [ ] Create Setoran ✓
- [ ] Check Saldo ✓
- [ ] Get Dashboard Stats ✓

---

## 🚨 Remember

1. **Always use Bearer token** for authenticated requests
2. **Save access token** after login
3. **Check role permissions** before calling endpoints
4. **Validate input** before sending to API
5. **Handle errors** with try-catch
6. **Show loading states** during API calls
7. **Refresh data** after mutations
8. **Logout on 401** errors

---

## 📱 Quick Contact

**Demo Credentials:**
```
Admin: admin / admin123
Warga: warga123 / password
Petugas: petugas / petugas123
```

**Periode Format:** `YYYY-MM` (e.g., "2025-01")

---

**Happy Coding! 🎉**
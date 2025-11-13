# Sistem Data Kosong - Harus Diisi Manual

## ✅ Perubahan Yang Sudah Dilakukan

### 1. **Login Page** - Tidak Ada Demo Credentials
- ❌ Sudah dihapus semua demo credentials (admin, warga, petugas)
- ✅ User harus daftar dahulu untuk bisa login
- ✅ Hanya tersedia link "Daftar sekarang" untuk Warga dan Admin

### 2. **Backend** - Data Awal Kosong
- ✅ Tidak ada data pre-populated
- ✅ Semua data mulai dari 0 (nol)
- ✅ User pertama harus register secara manual

### 3. **Database** - Harus Isi Manual
- ✅ Tidak ada sample data otomatis
- ✅ Tidak ada seed script yang auto-run
- ✅ Semua tabel/collection mulai kosong

---

## 📋 Cara Mulai Menggunakan Sistem

### Step 1: Register Admin Pertama
1. Buka aplikasi
2. Pilih role "Admin"
3. Klik "Daftar sekarang"
4. Isi form registrasi:
   - Nama Lengkap
   - Email
   - Username
   - Password (minimal 6 karakter)
5. Klik "Daftar"
6. Login dengan akun yang baru dibuat

### Step 2: Login Sebagai Admin
1. Pilih role "Admin"
2. Masukkan username/email dan password
3. Klik "Login"

### Step 3: Setup Data Awal (sebagai Admin)
Setelah login sebagai Admin, isi data-data berikut:

#### A. Buat Petugas Bank Sampah
1. Buka menu "Manajemen Petugas"
2. Klik tombol "Tambah Petugas"
3. Isi data petugas
4. Simpan

#### B. Buat Harga Sampah
1. Buka menu "Manajemen Bank Sampah"
2. Klik "Tambah Harga Sampah"
3. Isi:
   - Jenis Sampah (mis: Plastik PET)
   - Kategori (mis: Plastik)
   - Harga per Kg (mis: 3000)
   - Satuan (kg)
4. Ulangi untuk jenis sampah lainnya

#### C. Buat Jadwal Pengangkutan
1. Buka menu "Manajemen Jadwal"
2. Klik "Tambah Jadwal"
3. Isi:
   - Hari (mis: Senin)
   - Waktu (mis: 07:00)
   - Jenis Sampah (mis: Sampah Organik)
   - Blok (mis: Semua)
4. Ulangi untuk jadwal lainnya

#### D. Buat Informasi/Pengumuman
1. Buka menu "Manajemen Informasi"
2. Klik "Tambah Informasi"
3. Isi:
   - Judul
   - Konten
   - Kategori (Pengumuman/Panduan/Kegiatan)
   - Prioritas (tinggi/normal/rendah)
4. Simpan

### Step 4: Warga Mendaftar
1. Warga membuka aplikasi
2. Pilih role "Warga"
3. Klik "Daftar sekarang"
4. Isi form lengkap:
   - Nama Lengkap
   - Email
   - Username
   - Password
   - Blok (A/B/C/D)
   - No. Rumah
   - No. Telepon
5. Klik "Daftar"
6. Login dengan akun baru

### Step 5: Admin Buat Iuran untuk Warga
1. Login sebagai Admin
2. Buka menu "Manajemen Iuran"
3. Pilih warga
4. Pilih periode (bulan/tahun)
5. Masukkan jumlah iuran
6. Status akan otomatis "Belum Bayar"
7. Simpan

### Step 6: Petugas Input Setoran
1. Petugas login ke sistem
2. Buka "Input Setoran"
3. Pilih warga
4. Input jenis sampah dan berat
5. Sistem akan hitung otomatis berdasarkan harga sampah
6. Submit setoran
7. Saldo warga bertambah otomatis

---

## 🔄 Workflow Lengkap

```
1. Admin Register & Login
   ↓
2. Admin Setup:
   - Buat Petugas
   - Input Harga Sampah
   - Buat Jadwal
   - Buat Pengumuman
   ↓
3. Warga Register & Login
   ↓
4. Admin Buat Iuran untuk Warga
   ↓
5. Warga Bayar Iuran (via QRIS/Transfer)
   ↓
6. Warga Setor Sampah ke Petugas
   ↓
7. Petugas Input Setoran
   ↓
8. Saldo Warga Bertambah
```

---

## ⚠️ Penting!

### Tidak Ada Data Demo
- ✅ Semua data harus diisi manual
- ✅ Tidak ada akun default
- ✅ Tidak ada sample data otomatis
- ✅ Database mulai dari kosong total

### Akun Pertama = Admin
- Akun pertama yang dibuat disarankan sebagai **Admin**
- Admin akan setup data awal
- Warga kemudian bisa mendaftar sendiri
- Petugas dibuat oleh Admin

### Data Yang Harus Diisi Admin:
1. **Harga Sampah** - Sebelum petugas bisa input setoran
2. **Jadwal** - Agar warga tahu kapan buang sampah
3. **Informasi** - Pengumuman untuk warga
4. **Iuran** - Setup iuran bulanan untuk setiap warga

---

## 📝 Checklist Setup Awal

- [ ] Admin sudah register dan login
- [ ] Minimal 1 Petugas sudah dibuat
- [ ] Minimal 5 jenis Harga Sampah sudah diinput
- [ ] Jadwal pengangkutan sampah sudah dibuat
- [ ] Informasi/pengumuman awal sudah dibuat
- [ ] Minimal 1 Warga sudah register
- [ ] Iuran untuk warga sudah dibuat

---

## 🚀 Siap Digunakan!

Setelah semua checklist di atas selesai, sistem siap digunakan oleh:
- **Admin** - Mengelola semua data
- **Warga** - Lihat iuran, bayar iuran, setor sampah
- **Petugas** - Input setoran sampah warga

---

**Catatan:** Sistem ini dirancang agar semua data diisi manual oleh pengguna, tidak ada data otomatis atau demo account.

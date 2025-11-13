# Panduan Setup Lengkap - Sistem Informasi Warga RT

## Overview

Sistem ini adalah aplikasi web berbasis React untuk mengelola data warga RT, iuran bulanan, dan bank sampah. Sistem dimulai dari kondisi kosong dan harus diisi manual oleh pengguna sesuai workflow yang telah ditentukan.

## Teknologi

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Payment**: Bank BRI (Transfer)
- **Framework Backend**: Hono (untuk Supabase Edge Functions)

## Workflow Sistem

```
1. Admin RT pertama melakukan registrasi
   ↓
2. Admin melakukan setup data awal (jenis sampah, jadwal, dll)
   ↓
3. Warga mendaftar sendiri melalui form registrasi
   ↓
4. Admin menambahkan petugas bank sampah (opsional)
   ↓
5. Sistem siap digunakan untuk operasional normal
```

## Tahap 1: Setup Database Supabase

### 1.1 Buat Project Supabase

1. Login ke [https://supabase.com](https://supabase.com)
2. Klik "New Project"
3. Isi informasi project:
   - Name: `sikas-rt` (atau nama lain)
   - Database Password: Pilih password yang kuat
   - Region: Southeast Asia (Singapore) - recommended
4. Tunggu hingga project selesai dibuat (~2 menit)

### 1.2 Eksekusi SQL Schema

1. Buka Supabase Dashboard → SQL Editor
2. Copy seluruh script SQL dari file `/DATABASE_SCHEMA.md`
3. Eksekusi script satu per satu atau gabungkan dalam satu eksekusi
4. Pastikan semua tabel berhasil dibuat tanpa error

### 1.3 Konfigurasi Authentication

1. Buka Authentication → Settings
2. Konfigurasi berikut:
   - Enable Email Auth: **ON**
   - Confirm Email: **ON** (recommended untuk production)
   - Enable Phone Auth: **OFF** (tidak digunakan)
3. Site URL: Isi dengan URL production Anda
4. Redirect URLs: Tambahkan URL callback jika diperlukan

### 1.4 Setup Row Level Security (RLS)

1. RLS sudah dikonfigurasi di schema SQL
2. Pastikan semua tabel memiliki RLS enabled
3. Test RLS dengan login sebagai user berbeda untuk memastikan policy bekerja

## Tahap 2: Konfigurasi Environment Variables

### 2.1 File `.env.local` (Frontend)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Cara mendapatkan:**
1. Buka Supabase Dashboard → Settings → API
2. Copy `Project URL` → masukkan ke `VITE_SUPABASE_URL`
3. Copy `anon/public key` → masukkan ke `VITE_SUPABASE_ANON_KEY`

### 2.2 Environment untuk Edge Functions

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
```

**Cara mendapatkan:**
1. Service Role Key: Supabase Dashboard → Settings → API → `service_role key`
2. JWT Secret: Supabase Dashboard → Settings → API → JWT Settings → `JWT Secret`

## Tahap 3: Deploy Supabase Edge Functions

### 3.1 Install Supabase CLI

```bash
npm install -g supabase
```

### 3.2 Login ke Supabase

```bash
supabase login
```

### 3.3 Link Project

```bash
supabase link --project-ref your-project-ref
```

Project ref bisa dilihat di URL dashboard: `https://app.supabase.com/project/[PROJECT_REF]`

### 3.4 Deploy Functions

```bash
supabase functions deploy server
```

### 3.5 Set Environment Variables untuk Functions

```bash
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your-anon-key
supabase secrets set JWT_SECRET=your-jwt-secret
```

## Tahap 4: Registrasi Admin Pertama

### 4.1 Akses Halaman Registrasi

1. Buka aplikasi web
2. Klik role "Admin"
3. Klik "Daftar sekarang"

### 4.2 Isi Form Registrasi Admin

**Data yang harus diisi:**
- Nama Lengkap: Nama lengkap admin RT
- Email: Email aktif (akan digunakan untuk verifikasi)
- Jabatan: Ketua RT / Sekretaris / Bendahara
- **Nomor Rekening BRI**: Nomor rekening BRI RT (wajib)
- **Nama Pemilik Rekening**: Nama sesuai buku tabungan BRI
- Username: Username untuk login
- Password: Minimal 6 karakter
- Konfirmasi Password: Harus sama dengan password

### 4.3 Verifikasi Email (jika enabled)

1. Cek email yang didaftarkan
2. Klik link verifikasi dari Supabase
3. Email terverifikasi, akun siap digunakan

### 4.4 Login Pertama Kali

1. Kembali ke halaman login
2. Pilih role "Admin"
3. Masukkan username dan password
4. Login berhasil → masuk ke dashboard admin

## Tahap 5: Setup Data Awal oleh Admin

### 5.1 Setup Jenis Sampah dan Harga

1. Login sebagai admin
2. Buka menu "Manajemen Bank Sampah"
3. Tambahkan jenis sampah:
   - **Kardus**: Rp 1.500/kg
   - **Botol Plastik**: Rp 1.000/kg
   - **Kertas**: Rp 800/kg
   - **Besi/Logam**: Rp 3.000/kg
   - **Kaleng Aluminium**: Rp 2.500/kg
   - **Kaca/Botol Kaca**: Rp 500/kg

### 5.2 Setup Informasi RT

1. Buka menu "Manajemen Informasi" → "Informasi RT"
2. Isi data:
   - Nama RT: RT 05
   - Nama RW: RW 02
   - Kelurahan: (sesuai wilayah Anda)
   - Kecamatan: (sesuai wilayah Anda)
   - Ketua RT: Nama ketua RT
   - Periode: Tahun mulai - Tahun selesai

### 5.3 Setup Jadwal Pengangkutan Sampah

1. Buka menu "Manajemen Jadwal"
2. Tambahkan jadwal pengangkutan:
   - Hari: Pilih hari (Senin-Minggu)
   - Waktu Mulai: 07:00
   - Waktu Selesai: 09:00
   - Jenis Sampah: Organik/Anorganik/Semua
   - Lokasi: Area RT

### 5.4 Setup Peraturan RT

1. Buka menu "Manajemen Informasi" → "Peraturan"
2. Tambahkan peraturan yang berlaku di RT
3. Contoh:
   - Jam istirahat: 12:00-14:00 dan 21:00-06:00
   - Parkir kendaraan tidak menghalangi jalan
   - Pembuangan sampah terpisah organik/anorganik

### 5.5 Setup Kontak Pengurus

1. Buka menu "Manajemen Informasi" → "Kontak"
2. Tambahkan kontak pengurus RT:
   - Ketua RT + nomor telepon
   - Sekretaris + nomor telepon
   - Bendahara + nomor telepon
   - Seksi Keamanan + nomor telepon

## Tahap 6: Registrasi Warga

### 6.1 Akses Halaman Registrasi

1. Buka aplikasi web
2. Klik role "Warga"
3. Klik "Daftar sekarang"

### 6.2 Isi Form Registrasi Warga

**Data yang harus diisi:**
- Nama Lengkap: Nama lengkap warga
- Email: Email aktif
- **Blok**: Pilih blok rumah (A, B, C, D)
- **No. Rumah**: Nomor rumah
- **No. Telepon**: Nomor telepon aktif
- Username: Username untuk login
- Password: Minimal 6 karakter
- Konfirmasi Password: Harus sama dengan password

### 6.3 Warga Login

1. Setelah registrasi berhasil
2. Login dengan username dan password
3. Masuk ke dashboard warga

## Tahap 7: Tambah Petugas Bank Sampah (Opsional)

### 7.1 Admin Menambah Petugas

1. Login sebagai admin
2. Buka menu "Manajemen Petugas"
3. Klik "Tambah Petugas"
4. Isi data petugas:
   - Nama Lengkap
   - Email
   - No. Telepon
   - Shift: Pagi/Siang/Malam
   - Wilayah Tanggung Jawab: Pilih blok
5. Simpan

### 7.2 Petugas Menerima Akses

1. Petugas akan menerima email dengan kredensial login
2. Petugas login dengan username/email dan password
3. Masuk ke dashboard petugas bank sampah

## Tahap 8: Operasional Normal

### 8.1 Admin Membuat Tagihan Iuran

1. Login sebagai admin
2. Buka menu "Manajemen Iuran"
3. Klik "Buat Tagihan Bulan Ini"
4. Sistem akan otomatis membuat tagihan untuk semua warga
5. Atur nominal iuran (default atau custom per warga)
6. Atur tanggal jatuh tempo
7. Klik "Buat Tagihan"

### 8.2 Warga Membayar Iuran

1. Warga login ke dashboard
2. Lihat status iuran bulan ini
3. Klik "Bayar Sekarang"
4. **Metode Pembayaran: Transfer Bank BRI**
5. Warga akan melihat informasi:
   - Nomor Rekening BRI RT
   - Nama Pemilik Rekening
   - Nominal yang harus dibayar
6. Warga melakukan transfer melalui mobile banking/ATM BRI
7. Warga upload bukti transfer (opsional)
8. Klik "Konfirmasi Pembayaran"

### 8.3 Admin Verifikasi Pembayaran

1. Admin login
2. Buka menu "Verifikasi Pembayaran"
3. Lihat daftar pembayaran yang pending
4. Cek bukti transfer dan rekening bank
5. Klik "Verifikasi" jika pembayaran valid
6. Status iuran warga otomatis berubah menjadi "Lunas"

### 8.4 Petugas Input Setoran Sampah

1. Petugas login
2. Klik "Input Setoran"
3. Cari warga berdasarkan nama/nomor rumah
4. Pilih warga
5. Input detail sampah:
   - Jenis sampah (pilih dari daftar)
   - Berat (kg)
6. Sistem menghitung otomatis nilai setoran
7. Klik "Simpan Transaksi"
8. Saldo bank sampah warga otomatis bertambah

### 8.5 Warga Tarik Saldo Bank Sampah

1. Warga login
2. Buka menu "Bank Sampah"
3. Lihat saldo saat ini
4. Klik "Tarik Saldo"
5. Pilih metode:
   - **Bayar Iuran**: Saldo digunakan untuk bayar iuran
   - **Transfer**: Ditransfer ke rekening warga
   - **Tunai**: Ambil tunai dari bendahara
6. Input jumlah penarikan
7. Klik "Ajukan Penarikan"
8. Admin akan menerima notifikasi dan menyetujui

## Fitur Utama Sistem

### Untuk Admin RT
- ✅ Dashboard overview (total warga, iuran, bank sampah)
- ✅ Manajemen data warga
- ✅ Membuat dan mengelola tagihan iuran
- ✅ Verifikasi pembayaran iuran
- ✅ Manajemen bank sampah (jenis sampah, harga)
- ✅ Manajemen petugas bank sampah
- ✅ Manajemen jadwal pengangkutan
- ✅ Manajemen informasi dan pengumuman
- ✅ Laporan keuangan dan bank sampah
- ✅ Setup rekening BRI untuk pembayaran

### Untuk Warga
- ✅ Dashboard personal
- ✅ Lihat status iuran bulanan
- ✅ Bayar iuran via Transfer BRI
- ✅ Lihat saldo bank sampah
- ✅ Riwayat setoran dan penarikan bank sampah
- ✅ Riwayat pembayaran iuran
- ✅ Lihat jadwal pengangkutan sampah
- ✅ Lihat informasi dan pengumuman RT
- ✅ Lihat kegiatan RT

### Untuk Petugas Bank Sampah
- ✅ Input setoran sampah dari warga
- ✅ Lihat riwayat transaksi
- ✅ Dashboard statistik setoran

## Metode Pembayaran

### Bank BRI Transfer

**Sistem hanya menggunakan Bank BRI untuk pembayaran iuran.**

**Flow Pembayaran:**
1. Admin RT input nomor rekening BRI saat registrasi
2. Warga klik "Bayar Iuran"
3. Sistem menampilkan informasi transfer:
   - Bank: BRI
   - Nomor Rekening: [Nomor rekening admin]
   - Nama Pemilik: [Nama sesuai buku tabungan]
   - Nominal: [Jumlah iuran]
4. Warga melakukan transfer via:
   - BRI Mobile
   - ATM BRI
   - Internet Banking BRI
   - Teller BRI
5. Warga upload bukti transfer (opsional)
6. Admin verifikasi pembayaran manual
7. Status berubah menjadi "Lunas"

**Keuntungan:**
- ✅ Mudah digunakan
- ✅ BRI tersedia di seluruh Indonesia
- ✅ Biaya admin rendah (sesama BRI gratis)
- ✅ Real-time tracking via mobile banking

## Keamanan

### Authentication & Authorization
- JWT-based authentication via Supabase Auth
- Role-based access control (Admin, Warga, Petugas)
- Row Level Security (RLS) di database
- Secure password hashing

### Data Protection
- HTTPS only
- Environment variables untuk sensitive data
- Input validation & sanitization
- SQL injection protection via Supabase

## Troubleshooting

### Issue: Email verifikasi tidak diterima
**Solusi:**
1. Cek spam folder
2. Pastikan email provider tidak memblokir
3. Cek di Supabase Dashboard → Authentication → Users → Pastikan user ada

### Issue: Login gagal setelah registrasi
**Solusi:**
1. Pastikan email sudah terverifikasi (jika enabled)
2. Cek password minimal 6 karakter
3. Cek di Supabase logs untuk error detail

### Issue: RLS blocking queries
**Solusi:**
1. Cek RLS policies sudah diset dengan benar
2. Pastikan user memiliki role yang sesuai
3. Test dengan disable RLS sementara untuk debugging

### Issue: Edge functions error
**Solusi:**
1. Cek logs: `supabase functions logs server`
2. Pastikan environment variables sudah diset
3. Redeploy function: `supabase functions deploy server`

## Support & Kontak

Untuk bantuan lebih lanjut:
- Dokumentasi Supabase: [https://supabase.com/docs](https://supabase.com/docs)
- GitHub Issues: Buat issue di repository project
- Email: [your-email@domain.com]

## Changelog

### Version 1.0.0 (2025-11-13)
- ✅ Initial release
- ✅ Sistem dimulai dari kosong
- ✅ Registrasi mandiri untuk Admin dan Warga
- ✅ Pembayaran hanya via Bank BRI
- ✅ Admin input rekening BRI saat registrasi
- ✅ Database schema lengkap
- ✅ API endpoints lengkap (30+)
- ✅ Multi-role system (Admin, Warga, Petugas)
- ✅ Empty state UI untuk semua halaman

---

**Sistem Informasi Warga RT** - Dibuat dengan ❤️ menggunakan React + Supabase

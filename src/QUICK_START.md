# Quick Start Guide - 5 Menit Setup

## ⚡ Langkah Cepat

### 1. Install Dependencies (1 menit)

```bash
npm install
npm install @supabase/supabase-js
```

### 2. Setup Supabase (2 menit)

1. **Buka** [https://supabase.com](https://supabase.com) → Login/Sign up
2. **Klik** "New Project"
3. **Isi**:
   - Name: `sikas-rt`
   - Password: [buat password, simpan!]
   - Region: **Southeast Asia (Singapore)**
4. **Tunggu** ~2 menit sampai project ready

### 3. Setup Database (1 menit)

1. **Di Supabase Dashboard** → **SQL Editor**
2. **Copy semua kode SQL** dari file `/DATABASE_SCHEMA.md`
3. **Paste** ke SQL Editor
4. **Klik "Run"** (Ctrl/Cmd + Enter)
5. **Check** tidak ada error

### 4. Setup Environment Variables (1 menit)

1. **Di Supabase Dashboard** → **Settings** → **API**
2. **Copy**:
   - Project URL
   - anon public key

3. **Di VSCode**, buat file `.env.local`:

```env
VITE_SUPABASE_URL=https://[your-project].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

4. **Replace** dengan kredensial Anda

### 5. Run Development Server

```bash
npm run dev
```

**Buka browser**: [http://localhost:5173](http://localhost:5173)

## ✅ Test Koneksi

### 1. Register Admin Pertama

1. **Klik** "Admin"
2. **Klik** "Daftar sekarang"
3. **Isi form**:
   - Nama: Admin Test
   - Email: admin@test.com
   - Jabatan: Ketua RT
   - **Nomor Rekening BRI**: 1234567890
   - **Nama Pemilik**: Admin Test
   - Password: 123456
4. **Klik** "Daftar"

### 2. Verifikasi di Supabase

1. **Supabase Dashboard** → **Authentication** → **Users**
2. **Check**: User `admin@test.com` ada ✅

3. **Table Editor** → **profiles**
4. **Check**: Profile ada ✅

5. **Table Editor** → **admin_rt**
6. **Check**: Data admin dengan rekening BRI ada ✅

### 3. Login

1. **Login** dengan admin@test.com / 123456
2. **Berhasil** masuk dashboard ✅

## 🎉 Selesai!

Sistem sudah running. Sekarang Anda bisa:

- ✅ Register warga baru
- ✅ Setup data awal (jenis sampah, jadwal, dll)
- ✅ Mulai operasional

## 📚 Next Steps

Baca panduan lengkap:
- **PANDUAN_KONEKSI.md** - Setup detail frontend-backend-database
- **SETUP_LENGKAP.md** - Panduan lengkap semua fitur
- **API_DOCUMENTATION.md** - Dokumentasi API endpoints

## ❓ Troubleshooting

### Error: "Missing Supabase environment variables"
→ Check file `.env.local` sudah dibuat dan diisi dengan benar
→ Restart dev server: `npm run dev`

### Error: "Failed to fetch"
→ Check koneksi internet
→ Check Supabase project status

### Error: "Invalid API key"
→ Copy ulang anon key dari Supabase Dashboard → Settings → API
→ Paste ke `.env.local`
→ Restart dev server

### Error saat registrasi
→ Check SQL schema sudah di-run semua
→ Check di Supabase Logs untuk detail error

## 💡 Tips

1. **Jangan commit** file `.env.local` ke Git
2. **Gunakan** `.env.local.example` sebagai template
3. **Check** Supabase logs jika ada error: Dashboard → Logs
4. **Test** setiap fitur satu per satu

## 🚀 Production Deployment

Untuk deploy ke production:

1. **Vercel/Netlify**: 
   - Connect GitHub repo
   - Add environment variables
   - Deploy

2. **Environment Variables** yang perlu diset:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. **Update** Supabase Auth URLs:
   - Dashboard → Authentication → URL Configuration
   - Add production URL

---

**Selamat mencoba! 🎊**

Jika ada pertanyaan, check dokumentasi lengkap atau buat issue di GitHub.

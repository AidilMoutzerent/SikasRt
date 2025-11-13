# Panduan Lengkap: Menyambungkan Frontend, Backend, dan Database

## Overview Arsitektur

```
┌─────────────────┐      ┌──────────────────────┐      ┌─────────────────┐
│   Frontend      │ ───> │  Supabase Backend    │ ───> │   PostgreSQL    │
│   React + TS    │      │  - Auth              │      │   Database      │
│   VSCode        │      │  - Edge Functions    │      │   (Cloud)       │
└─────────────────┘      └──────────────────────┘      └─────────────────┘
```

## Langkah 1: Setup Supabase Project

### 1.1 Buat Project Supabase

1. **Buka browser**, kunjungi [https://supabase.com](https://supabase.com)
2. **Sign up/Login** menggunakan GitHub atau email
3. **Klik "New Project"**
4. **Isi form**:
   - Organization: Pilih atau buat baru
   - Name: `sikas-rt-production` (atau nama lain)
   - Database Password: **Simpan password ini!** (akan dipakai nanti)
   - Region: **Southeast Asia (Singapore)** - paling dekat dengan Indonesia
5. **Klik "Create new project"**
6. **Tunggu ~2 menit** sampai project selesai dibuat

### 1.2 Catat Kredensial Project

Setelah project dibuat:

1. **Buka Supabase Dashboard** → Project → **Settings** → **API**
2. **Copy dan simpan** data berikut ke notepad:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGc...
service_role key: eyJhbGc...
```

3. **Buka** → **Settings** → **Database**
4. **Copy dan simpan**:

```
Database Password: [password yang Anda buat tadi]
Connection String: postgresql://postgres:[YOUR-PASSWORD]@...
```

## Langkah 2: Setup Database Schema

### 2.1 Buka SQL Editor

1. **Di Supabase Dashboard** → Klik **SQL Editor** (di sidebar kiri)
2. Klik **"+ New query"**

### 2.2 Copy Script dari DATABASE_SCHEMA.md

1. **Buka VSCode**
2. **Buka file** `/DATABASE_SCHEMA.md`
3. **Copy semua kode SQL** (mulai dari CREATE TABLE sampai selesai)

### 2.3 Jalankan Script SQL

1. **Paste** ke Supabase SQL Editor
2. **Klik "Run"** (atau Ctrl/Cmd + Enter)
3. **Tunggu** sampai selesai
4. **Check** apakah ada error:
   - ✅ Jika berhasil: "Success. No rows returned"
   - ❌ Jika error: Lihat pesan error dan perbaiki

### 2.4 Verifikasi Tabel Sudah Dibuat

1. **Di Supabase Dashboard** → **Table Editor**
2. **Check** apakah tabel-tabel ini ada:
   - profiles
   - warga
   - admin_rt
   - iuran
   - pembayaran_iuran
   - jenis_sampah
   - setoran_sampah
   - dll (19 tabel total)

## Langkah 3: Setup Environment Variables di VSCode

### 3.1 Buat File .env.local

1. **Di VSCode**, buka folder root project
2. **Klik kanan** di sidebar → **New File**
3. **Nama file**: `.env.local`
4. **Paste** kode berikut:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: For local development
VITE_API_BASE_URL=https://xxxxxxxxxxxxx.supabase.co/functions/v1
```

5. **Replace** `xxxxxxxxxxxxx` dengan kredensial Anda dari Langkah 1.2

### 3.2 Simpan dan Check .gitignore

1. **Buka file** `.gitignore`
2. **Pastikan ada** baris ini:

```
.env.local
.env
```

3. **Jika belum ada**, tambahkan agar kredensial tidak ter-push ke GitHub

## Langkah 4: Install Supabase Client di Frontend

### 4.1 Install Dependencies

1. **Buka Terminal** di VSCode (Ctrl/Cmd + `)
2. **Jalankan**:

```bash
npm install @supabase/supabase-js
```

3. **Tunggu** sampai selesai

### 4.2 Buat Supabase Client

1. **Buat folder** `src/lib` (jika belum ada)
2. **Buat file** `src/lib/supabase.ts`
3. **Copy code** ini:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Langkah 5: Buat API Services

### 5.1 Buat File Auth Service

**File**: `src/services/auth.service.ts`

```typescript
import { supabase } from '../lib/supabase'

export interface RegisterData {
  email: string
  password: string
  nama: string
  role: 'admin' | 'warga' | 'petugas'
  telepon?: string
  // Warga
  blok?: string
  nomor_rumah?: string
  // Admin
  jabatan?: string
  nomor_rekening_bri?: string
  nama_pemilik_rekening?: string
}

export interface LoginData {
  email: string
  password: string
}

export const authService = {
  // Register
  async register(data: RegisterData) {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nama: data.nama,
            role: data.role,
          },
        },
      })

      if (authError) throw authError

      // 2. Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user!.id,
          email: data.email,
          nama: data.nama,
          role: data.role,
          telepon: data.telepon,
        })

      if (profileError) throw profileError

      // 3. Create role-specific data
      if (data.role === 'warga') {
        const { error: wargaError } = await supabase
          .from('warga')
          .insert({
            user_id: authData.user!.id,
            blok: data.blok,
            nomor_rumah: data.nomor_rumah,
          })

        if (wargaError) throw wargaError
      } else if (data.role === 'admin') {
        const { error: adminError } = await supabase
          .from('admin_rt')
          .insert({
            user_id: authData.user!.id,
            jabatan: data.jabatan,
            nomor_rekening_bri: data.nomor_rekening_bri,
            nama_pemilik_rekening: data.nama_pemilik_rekening,
          })

        if (adminError) throw adminError
      }

      return { success: true, data: authData }
    } catch (error: any) {
      console.error('Register error:', error)
      return { success: false, error: error.message }
    }
  },

  // Login
  async login(data: LoginData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      // Get user profile with role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profileError) throw profileError

      return { 
        success: true, 
        data: {
          user: authData.user,
          profile: profile,
          session: authData.session,
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  },

  // Logout
  async logout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error: any) {
      console.error('Logout error:', error)
      return { success: false, error: error.message }
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return { success: false, data: null }

      // Get profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      return { success: true, data: { user, profile } }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },
}
```

### 5.2 Buat File Iuran Service

**File**: `src/services/iuran.service.ts`

```typescript
import { supabase } from '../lib/supabase'

export const iuranService = {
  // Get iuran for current warga
  async getMyIuran() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get warga_id
      const { data: warga } = await supabase
        .from('warga')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!warga) throw new Error('Warga not found')

      // Get iuran
      const { data, error } = await supabase
        .from('iuran')
        .select('*')
        .eq('warga_id', warga.id)
        .order('tahun', { ascending: false })
        .order('bulan', { ascending: false })

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error: any) {
      console.error('Get iuran error:', error)
      return { success: false, error: error.message, data: [] }
    }
  },

  // Get iuran by month/year
  async getIuranByPeriod(bulan: number, tahun: number) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: warga } = await supabase
        .from('warga')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!warga) throw new Error('Warga not found')

      const { data, error } = await supabase
        .from('iuran')
        .select('*')
        .eq('warga_id', warga.id)
        .eq('bulan', bulan)
        .eq('tahun', tahun)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return { success: true, data: data || null }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // Admin: Get all iuran
  async getAllIuran(filters?: { bulan?: number; tahun?: number; status?: string }) {
    try {
      let query = supabase
        .from('iuran')
        .select(`
          *,
          warga:warga_id (
            id,
            blok,
            nomor_rumah,
            profiles:user_id (
              nama,
              email
            )
          )
        `)
        .order('tahun', { ascending: false })
        .order('bulan', { ascending: false })

      if (filters?.bulan) query = query.eq('bulan', filters.bulan)
      if (filters?.tahun) query = query.eq('tahun', filters.tahun)
      if (filters?.status) query = query.eq('status', filters.status)

      const { data, error } = await query

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error: any) {
      return { success: false, error: error.message, data: [] }
    }
  },

  // Create iuran (Admin only)
  async createIuran(iuranData: {
    warga_id: string
    bulan: number
    tahun: number
    nominal: number
    tanggal_jatuh_tempo: string
  }) {
    try {
      const { data, error } = await supabase
        .from('iuran')
        .insert(iuranData)
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },
}
```

### 5.3 Buat File Bank Sampah Service

**File**: `src/services/bank-sampah.service.ts`

```typescript
import { supabase } from '../lib/supabase'

export const bankSampahService = {
  // Get saldo for current warga
  async getMySaldo() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: warga } = await supabase
        .from('warga')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!warga) throw new Error('Warga not found')

      const { data, error } = await supabase
        .from('saldo_bank_sampah')
        .select('*')
        .eq('warga_id', warga.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return { 
        success: true, 
        data: data || { saldo: 0, total_setoran: 0, total_penarikan: 0 } 
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },

  // Get jenis sampah
  async getJenisSampah() {
    try {
      const { data, error } = await supabase
        .from('jenis_sampah')
        .select('*')
        .eq('is_active', true)
        .order('nama')

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error: any) {
      return { success: false, error: error.message, data: [] }
    }
  },

  // Get riwayat setoran
  async getMySetoran() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: warga } = await supabase
        .from('warga')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!warga) throw new Error('Warga not found')

      const { data, error } = await supabase
        .from('setoran_sampah')
        .select(`
          *,
          petugas:petugas_id (
            profiles:user_id (
              nama
            )
          ),
          detail:detail_setoran_sampah (
            *,
            jenis:jenis_sampah_id (
              nama,
              satuan
            )
          )
        `)
        .eq('warga_id', warga.id)
        .order('tanggal_setor', { ascending: false })

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error: any) {
      return { success: false, error: error.message, data: [] }
    }
  },
}
```

## Langkah 6: Update Login Page untuk Menggunakan API

### 6.1 Update login-page.tsx

**Buka file**: `/components/pages/login-page.tsx`

**Update import**:
```typescript
import { authService, type RegisterData, type LoginData } from '../../services/auth.service'
```

**Update handleLogin**:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  const result = await authService.login({
    email: formData.username, // atau email
    password: formData.password,
  })

  if (result.success) {
    toast.success('Login berhasil!')
    onLogin(result.data.profile.role)
  } else {
    toast.error(result.error || 'Login gagal')
  }
}
```

**Update handleRegister**:
```typescript
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // Validation
  if (registerData.password !== registerData.confirmPassword) {
    toast.error('Password tidak cocok!')
    return
  }

  if (registerData.password.length < 6) {
    toast.error('Password minimal 6 karakter!')
    return
  }

  // Prepare data
  const data: RegisterData = {
    email: registerData.email,
    password: registerData.password,
    nama: registerData.namaLengkap,
    role: selectedRole!,
    telepon: registerData.noTelepon,
  }

  // Add role-specific fields
  if (selectedRole === 'warga') {
    data.blok = registerData.blok
    data.nomor_rumah = registerData.nomorRumah
  } else if (selectedRole === 'admin') {
    data.jabatan = registerData.jabatan
    data.nomor_rekening_bri = registerData.nomorRekeningBRI
    data.nama_pemilik_rekening = registerData.namaPemilikRekening
  }

  // Register
  const result = await authService.register(data)

  if (result.success) {
    toast.success('Registrasi berhasil! Silakan login.')
    setIsRegisterMode(false)
  } else {
    toast.error(result.error || 'Registrasi gagal')
  }
}
```

## Langkah 7: Test Koneksi

### 7.1 Jalankan Development Server

1. **Buka Terminal** di VSCode
2. **Jalankan**:

```bash
npm run dev
```

3. **Buka browser**: `http://localhost:5173` (atau port yang ditampilkan)

### 7.2 Test Registrasi Admin

1. **Klik role "Admin"**
2. **Klik "Daftar sekarang"**
3. **Isi form**:
   - Nama Lengkap: Admin Test
   - Email: admin@test.com
   - Jabatan: Ketua RT
   - Nomor Rekening BRI: 1234567890
   - Nama Pemilik: Admin Test
   - Username: admin
   - Password: 123456
   - Confirm: 123456
4. **Klik "Daftar"**
5. **Check**:
   - ✅ Toast "Registrasi berhasil"
   - ✅ Redirect ke login

### 7.3 Verifikasi di Supabase Dashboard

1. **Buka Supabase Dashboard**
2. **Authentication** → **Users**
3. **Check**: User `admin@test.com` ada
4. **Table Editor** → **profiles**
5. **Check**: Profile dengan email `admin@test.com` ada
6. **Table Editor** → **admin_rt**
7. **Check**: Data admin dengan rekening BRI ada

### 7.4 Test Login

1. **Login** dengan:
   - Email: admin@test.com
   - Password: 123456
2. **Check**:
   - ✅ Login berhasil
   - ✅ Masuk ke dashboard admin

## Langkah 8: Debug Jika Ada Error

### 8.1 Check Console Browser

1. **Buka browser** → **F12** → **Console**
2. **Lihat error message**
3. **Common errors**:

```
❌ "Missing Supabase environment variables"
→ Check .env.local file
→ Restart dev server

❌ "Failed to fetch"
→ Check internet connection
→ Check Supabase project status

❌ "Invalid API key"
→ Check VITE_SUPABASE_ANON_KEY di .env.local
→ Copy ulang dari Supabase Dashboard
```

### 8.2 Check Network Tab

1. **F12** → **Network**
2. **Filter**: Fetch/XHR
3. **Cari** request ke Supabase
4. **Check**:
   - Status: Harus 200 atau 201
   - Response: Check error message

### 8.3 Check Supabase Logs

1. **Supabase Dashboard** → **Logs**
2. **Filter**: Errors only
3. **Check**: Error messages

## Langkah 9: Setup Database Triggers (Penting!)

Agar data otomatis ter-update, jalankan trigger ini:

**Buka SQL Editor**, paste dan run:

```sql
-- Update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warga_updated_at 
  BEFORE UPDATE ON warga
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_rt_updated_at 
  BEFORE UPDATE ON admin_rt
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update saldo after setoran
CREATE OR REPLACE FUNCTION update_saldo_after_setoran()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO saldo_bank_sampah (warga_id, saldo, total_setoran)
  VALUES (NEW.warga_id, 0, 0)
  ON CONFLICT (warga_id) DO NOTHING;
  
  UPDATE saldo_bank_sampah
  SET 
    saldo = saldo + NEW.total_nilai,
    total_setoran = total_setoran + NEW.total_nilai,
    updated_at = NOW()
  WHERE warga_id = NEW.warga_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_saldo_after_setoran
  AFTER INSERT ON setoran_sampah
  FOR EACH ROW EXECUTE FUNCTION update_saldo_after_setoran();
```

## Langkah 10: Next Steps

Setelah koneksi berhasil:

1. ✅ **Buat services untuk semua fitur**:
   - pembayaran.service.ts
   - jadwal.service.ts
   - pengumuman.service.ts
   - dll

2. ✅ **Update semua komponen** untuk menggunakan real API

3. ✅ **Tambah loading states** dan error handling

4. ✅ **Test semua fitur** satu per satu

## Troubleshooting Umum

### Error: "Failed to create user"
- Check email belum terdaftar
- Check password minimal 6 karakter
- Check di Authentication settings: Email auth enabled

### Error: "Row Level Security"
- RLS policies belum diset
- Run semua policy SQL dari DATABASE_SCHEMA.md
- Atau disable RLS untuk testing (tidak recommended)

### Error: "Invalid JWT"
- Token expired, login ulang
- Check JWT secret di Supabase settings

### Error: "CORS"
- Harus run dari localhost atau domain yang registered
- Check Site URL di Supabase Auth settings

## Struktur File Final

```
/
├── src/
│   ├── lib/
│   │   └── supabase.ts          ← Supabase client
│   ├── services/
│   │   ├── auth.service.ts      ← Authentication
│   │   ├── iuran.service.ts     ← Iuran/pembayaran
│   │   └── bank-sampah.service.ts ← Bank sampah
│   └── components/
│       └── pages/
│           └── login-page.tsx   ← Updated with real API
├── .env.local                    ← Environment variables (JANGAN DI-COMMIT!)
├── DATABASE_SCHEMA.md
└── PANDUAN_KONEKSI.md           ← File ini
```

## Selesai! 🎉

Sekarang frontend Anda sudah tersambung dengan Supabase (backend + database).

**Next**: Update semua komponen untuk menggunakan real data dari API.

---

**Butuh bantuan?** Check:
- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)

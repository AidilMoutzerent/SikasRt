# Database Schema - Sistem Informasi Warga RT

## Overview
Database ini menggunakan Supabase (PostgreSQL) dengan sistem autentikasi JWT dan Row Level Security (RLS).

## Tables

### 1. users
Tabel autentikasi utama (managed by Supabase Auth)
```sql
-- Menggunakan auth.users dari Supabase
-- Kolom tambahan di public.profiles
```

### 2. profiles
Tabel profil pengguna yang extend dari auth.users
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  nama TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'warga', 'petugas')),
  telepon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
```

### 3. admin_rt
Tabel data admin RT
```sql
CREATE TABLE admin_rt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  jabatan TEXT NOT NULL, -- 'ketua', 'sekretaris', 'bendahara'
  nomor_rekening_bri TEXT NOT NULL, -- Nomor rekening BRI untuk pembayaran
  nama_pemilik_rekening TEXT NOT NULL,
  periode_mulai DATE,
  periode_selesai DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_admin_rt_user_id ON admin_rt(user_id);
CREATE INDEX idx_admin_rt_is_active ON admin_rt(is_active);
```

### 4. warga
Tabel data warga
```sql
CREATE TABLE warga (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  nik TEXT UNIQUE,
  no_kk TEXT,
  blok TEXT NOT NULL,
  nomor_rumah TEXT NOT NULL,
  rt TEXT DEFAULT '05',
  rw TEXT DEFAULT '02',
  alamat_lengkap TEXT,
  kelurahan TEXT DEFAULT 'Mekar Sari',
  kecamatan TEXT,
  status_kepemilikan TEXT CHECK (status_kepemilikan IN ('milik_sendiri', 'kontrak', 'sewa')),
  jumlah_penghuni INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_warga_user_id ON warga(user_id);
CREATE INDEX idx_warga_blok ON warga(blok);
CREATE INDEX idx_warga_is_active ON warga(is_active);
CREATE UNIQUE INDEX idx_warga_blok_nomor ON warga(blok, nomor_rumah) WHERE is_active = true;
```

### 5. petugas_bank_sampah
Tabel data petugas bank sampah
```sql
CREATE TABLE petugas_bank_sampah (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  shift TEXT, -- 'pagi', 'siang', 'malam'
  wilayah_tanggungan TEXT[], -- Array of blok yang ditangani
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_petugas_user_id ON petugas_bank_sampah(user_id);
CREATE INDEX idx_petugas_is_active ON petugas_bank_sampah(is_active);
```

### 6. iuran
Tabel tagihan iuran bulanan
```sql
CREATE TABLE iuran (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warga_id UUID NOT NULL REFERENCES warga(id) ON DELETE CASCADE,
  bulan INTEGER NOT NULL CHECK (bulan BETWEEN 1 AND 12),
  tahun INTEGER NOT NULL,
  nominal BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'belum_lunas' CHECK (status IN ('belum_lunas', 'lunas')),
  tanggal_jatuh_tempo DATE,
  denda BIGINT DEFAULT 0,
  keterangan TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(warga_id, bulan, tahun)
);

-- Indexes
CREATE INDEX idx_iuran_warga_id ON iuran(warga_id);
CREATE INDEX idx_iuran_status ON iuran(status);
CREATE INDEX idx_iuran_periode ON iuran(tahun, bulan);
```

### 7. pembayaran_iuran
Tabel transaksi pembayaran iuran
```sql
CREATE TABLE pembayaran_iuran (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  iuran_id UUID NOT NULL REFERENCES iuran(id) ON DELETE CASCADE,
  warga_id UUID NOT NULL REFERENCES warga(id) ON DELETE CASCADE,
  jumlah_bayar BIGINT NOT NULL,
  metode_pembayaran TEXT NOT NULL DEFAULT 'transfer_bri' CHECK (metode_pembayaran = 'transfer_bri'),
  nomor_referensi TEXT, -- Nomor transaksi/referensi dari bank
  bukti_transfer TEXT, -- URL file bukti transfer (optional)
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  catatan TEXT,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pembayaran_iuran_id ON pembayaran_iuran(iuran_id);
CREATE INDEX idx_pembayaran_warga_id ON pembayaran_iuran(warga_id);
CREATE INDEX idx_pembayaran_status ON pembayaran_iuran(status);
CREATE INDEX idx_pembayaran_created_at ON pembayaran_iuran(created_at DESC);
```

### 8. jenis_sampah
Tabel master jenis sampah dan harga
```sql
CREATE TABLE jenis_sampah (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL UNIQUE,
  harga_per_kg BIGINT NOT NULL,
  satuan TEXT DEFAULT 'kg',
  deskripsi TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_jenis_sampah_is_active ON jenis_sampah(is_active);
```

### 9. setoran_sampah
Tabel transaksi setoran sampah dari warga
```sql
CREATE TABLE setoran_sampah (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warga_id UUID NOT NULL REFERENCES warga(id) ON DELETE CASCADE,
  petugas_id UUID NOT NULL REFERENCES petugas_bank_sampah(id),
  tanggal_setor DATE NOT NULL DEFAULT CURRENT_DATE,
  total_berat DECIMAL(10,2) NOT NULL,
  total_nilai BIGINT NOT NULL,
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_setoran_warga_id ON setoran_sampah(warga_id);
CREATE INDEX idx_setoran_petugas_id ON setoran_sampah(petugas_id);
CREATE INDEX idx_setoran_tanggal ON setoran_sampah(tanggal_setor DESC);
```

### 10. detail_setoran_sampah
Tabel detail per jenis sampah dalam setoran
```sql
CREATE TABLE detail_setoran_sampah (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setoran_id UUID NOT NULL REFERENCES setoran_sampah(id) ON DELETE CASCADE,
  jenis_sampah_id UUID NOT NULL REFERENCES jenis_sampah(id),
  berat DECIMAL(10,2) NOT NULL,
  harga_per_kg BIGINT NOT NULL,
  subtotal BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_detail_setoran_id ON detail_setoran_sampah(setoran_id);
CREATE INDEX idx_detail_jenis_sampah ON detail_setoran_sampah(jenis_sampah_id);
```

### 11. saldo_bank_sampah
Tabel saldo bank sampah per warga
```sql
CREATE TABLE saldo_bank_sampah (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warga_id UUID NOT NULL REFERENCES warga(id) ON DELETE CASCADE UNIQUE,
  saldo BIGINT NOT NULL DEFAULT 0,
  total_setoran BIGINT DEFAULT 0,
  total_penarikan BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_saldo_warga_id ON saldo_bank_sampah(warga_id);
```

### 12. penarikan_saldo
Tabel transaksi penarikan saldo bank sampah
```sql
CREATE TABLE penarikan_saldo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warga_id UUID NOT NULL REFERENCES warga(id) ON DELETE CASCADE,
  jumlah BIGINT NOT NULL,
  keperluan TEXT,
  metode TEXT CHECK (metode IN ('tunai', 'bayar_iuran', 'transfer')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_penarikan_warga_id ON penarikan_saldo(warga_id);
CREATE INDEX idx_penarikan_status ON penarikan_saldo(status);
CREATE INDEX idx_penarikan_created_at ON penarikan_saldo(created_at DESC);
```

### 13. jadwal_pengangkutan
Tabel jadwal pengangkutan sampah
```sql
CREATE TABLE jadwal_pengangkutan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hari TEXT NOT NULL, -- 'senin', 'selasa', dll
  waktu_mulai TIME NOT NULL,
  waktu_selesai TIME NOT NULL,
  jenis_sampah TEXT NOT NULL, -- 'organik', 'anorganik', 'semua'
  lokasi TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_jadwal_hari ON jadwal_pengangkutan(hari);
CREATE INDEX idx_jadwal_is_active ON jadwal_pengangkutan(is_active);
```

### 14. kegiatan_rt
Tabel kegiatan/acara RT
```sql
CREATE TABLE kegiatan_rt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  deskripsi TEXT,
  tanggal DATE NOT NULL,
  waktu_mulai TIME,
  waktu_selesai TIME,
  lokasi TEXT,
  kategori TEXT CHECK (kategori IN ('wajib', 'penting', 'opsional')),
  peserta_target TEXT, -- 'semua_warga', 'ketua_rt', 'ibu_balita', dll
  status TEXT DEFAULT 'dijadwalkan' CHECK (status IN ('dijadwalkan', 'berlangsung', 'selesai', 'dibatalkan')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_kegiatan_tanggal ON kegiatan_rt(tanggal DESC);
CREATE INDEX idx_kegiatan_status ON kegiatan_rt(status);
CREATE INDEX idx_kegiatan_kategori ON kegiatan_rt(kategori);
```

### 15. pengumuman
Tabel pengumuman RT
```sql
CREATE TABLE pengumuman (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  isi TEXT NOT NULL,
  kategori TEXT CHECK (kategori IN ('umum', 'kegiatan', 'iuran', 'bank_sampah', 'penting')),
  prioritas TEXT DEFAULT 'normal' CHECK (prioritas IN ('rendah', 'normal', 'tinggi', 'urgent')),
  is_pinned BOOLEAN DEFAULT false,
  tanggal_publikasi TIMESTAMPTZ DEFAULT NOW(),
  tanggal_kadaluarsa TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pengumuman_kategori ON pengumuman(kategori);
CREATE INDEX idx_pengumuman_prioritas ON pengumuman(prioritas);
CREATE INDEX idx_pengumuman_is_pinned ON pengumuman(is_pinned);
CREATE INDEX idx_pengumuman_tanggal ON pengumuman(tanggal_publikasi DESC);
```

### 16. kontak_pengurus
Tabel kontak pengurus RT
```sql
CREATE TABLE kontak_pengurus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_rt(id) ON DELETE CASCADE,
  jabatan TEXT NOT NULL,
  nama TEXT NOT NULL,
  telepon TEXT NOT NULL,
  email TEXT,
  urutan INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_kontak_admin_id ON kontak_pengurus(admin_id);
CREATE INDEX idx_kontak_is_active ON kontak_pengurus(is_active);
CREATE INDEX idx_kontak_urutan ON kontak_pengurus(urutan);
```

### 17. peraturan_rt
Tabel peraturan RT
```sql
CREATE TABLE peraturan_rt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  isi TEXT NOT NULL,
  kategori TEXT,
  urutan INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_peraturan_kategori ON peraturan_rt(kategori);
CREATE INDEX idx_peraturan_urutan ON peraturan_rt(urutan);
CREATE INDEX idx_peraturan_is_active ON peraturan_rt(is_active);
```

### 18. aktivitas_log
Tabel log aktivitas sistem
```sql
CREATE TABLE aktivitas_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  aksi TEXT NOT NULL,
  entitas TEXT NOT NULL, -- 'iuran', 'bank_sampah', 'warga', dll
  entitas_id UUID,
  detail JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_log_user_id ON aktivitas_log(user_id);
CREATE INDEX idx_log_entitas ON aktivitas_log(entitas);
CREATE INDEX idx_log_created_at ON aktivitas_log(created_at DESC);
```

### 19. informasi_rt
Tabel informasi umum RT
```sql
CREATE TABLE informasi_rt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_rt TEXT DEFAULT 'RT 05',
  nama_rw TEXT DEFAULT 'RW 02',
  kelurahan TEXT DEFAULT 'Mekar Sari',
  kecamatan TEXT,
  kota TEXT,
  provinsi TEXT,
  ketua_rt TEXT,
  periode_mulai INTEGER,
  periode_selesai INTEGER,
  jumlah_kk INTEGER DEFAULT 0,
  jumlah_jiwa INTEGER DEFAULT 0,
  logo_url TEXT,
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Row Level Security (RLS) Policies

### profiles
```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Admin can read all profiles
CREATE POLICY "Admin can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### warga
```sql
-- Enable RLS
ALTER TABLE warga ENABLE ROW LEVEL SECURITY;

-- Policy: Warga can read their own data
CREATE POLICY "Warga can read own data"
  ON warga FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Admin can read all warga
CREATE POLICY "Admin can read all warga"
  ON warga FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admin can manage warga
CREATE POLICY "Admin can manage warga"
  ON warga FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### iuran
```sql
-- Enable RLS
ALTER TABLE iuran ENABLE ROW LEVEL SECURITY;

-- Policy: Warga can read their own iuran
CREATE POLICY "Warga can read own iuran"
  ON iuran FOR SELECT
  USING (
    warga_id IN (
      SELECT id FROM warga WHERE user_id = auth.uid()
    )
  );

-- Policy: Admin can manage all iuran
CREATE POLICY "Admin can manage iuran"
  ON iuran FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## Functions & Triggers

### 1. Update timestamp trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warga_updated_at BEFORE UPDATE ON warga
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ... apply to all other tables
```

### 2. Update saldo after setoran
```sql
CREATE OR REPLACE FUNCTION update_saldo_after_setoran()
RETURNS TRIGGER AS $$
BEGIN
  -- Create saldo record if not exists
  INSERT INTO saldo_bank_sampah (warga_id, saldo, total_setoran)
  VALUES (NEW.warga_id, 0, 0)
  ON CONFLICT (warga_id) DO NOTHING;
  
  -- Update saldo
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

### 3. Update saldo after penarikan
```sql
CREATE OR REPLACE FUNCTION update_saldo_after_penarikan()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE saldo_bank_sampah
    SET 
      saldo = saldo - NEW.jumlah,
      total_penarikan = total_penarikan + NEW.jumlah,
      updated_at = NOW()
    WHERE warga_id = NEW.warga_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_saldo_after_penarikan
  AFTER UPDATE ON penarikan_saldo
  FOR EACH ROW 
  WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
  EXECUTE FUNCTION update_saldo_after_penarikan();
```

### 4. Update iuran status after payment
```sql
CREATE OR REPLACE FUNCTION update_iuran_after_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'verified' THEN
    UPDATE iuran
    SET 
      status = 'lunas',
      updated_at = NOW()
    WHERE id = NEW.iuran_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_iuran_after_payment
  AFTER UPDATE ON pembayaran_iuran
  FOR EACH ROW 
  WHEN (NEW.status = 'verified' AND OLD.status != 'verified')
  EXECUTE FUNCTION update_iuran_after_payment();
```

### 5. Auto create profile on user signup
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nama, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nama', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'warga')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## Initial Setup

### 1. Buat Admin Pertama
Admin pertama harus register melalui form registrasi dengan role 'admin' dan memasukkan nomor rekening BRI.

### 2. Setup Data Master
Setelah admin pertama terdaftar:
- Tambah jenis sampah dan harga
- Tambah informasi RT (nama, wilayah, dll)
- Tambah jadwal pengangkutan
- Tambah peraturan RT

### 3. Registrasi Warga
Warga mendaftar sendiri melalui form registrasi dengan role 'warga'.

### 4. Registrasi Petugas
Admin menambahkan petugas bank sampah melalui panel admin.

## Catatan Penting

1. **Metode Pembayaran**: Hanya Bank BRI yang digunakan
2. **Nomor Rekening**: Admin RT harus memasukkan nomor rekening BRI saat registrasi
3. **Verifikasi Pembayaran**: Pembayaran iuran perlu diverifikasi oleh admin
4. **Saldo Bank Sampah**: Dihitung otomatis menggunakan triggers
5. **RLS**: Semua tabel menggunakan Row Level Security untuk keamanan data

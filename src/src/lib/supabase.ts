import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Database Types
export interface Profile {
  id: string
  email: string
  nama: string
  role: 'admin' | 'warga' | 'petugas'
  telepon?: string
  created_at: string
  updated_at: string
}

export interface Warga {
  id: string
  user_id: string
  nik?: string
  no_kk?: string
  blok: string
  nomor_rumah: string
  rt: string
  rw: string
  alamat_lengkap?: string
  kelurahan: string
  kecamatan?: string
  status_kepemilikan?: 'milik_sendiri' | 'kontrak' | 'sewa'
  jumlah_penghuni: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AdminRT {
  id: string
  user_id: string
  jabatan: string
  nomor_rekening_bri: string
  nama_pemilik_rekening: string
  periode_mulai?: string
  periode_selesai?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Iuran {
  id: string
  warga_id: string
  bulan: number
  tahun: number
  nominal: number
  status: 'belum_lunas' | 'lunas'
  tanggal_jatuh_tempo?: string
  denda: number
  keterangan?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface PembayaranIuran {
  id: string
  iuran_id: string
  warga_id: string
  jumlah_bayar: number
  metode_pembayaran: 'transfer_bri'
  nomor_referensi?: string
  bukti_transfer?: string
  status: 'pending' | 'verified' | 'rejected'
  catatan?: string
  verified_by?: string
  verified_at?: string
  created_at: string
  updated_at: string
}

export interface JenisSampah {
  id: string
  nama: string
  harga_per_kg: number
  satuan: string
  deskripsi?: string
  is_active: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export interface SetoranSampah {
  id: string
  warga_id: string
  petugas_id: string
  tanggal_setor: string
  total_berat: number
  total_nilai: number
  catatan?: string
  created_at: string
  updated_at: string
}

export interface SaldoBankSampah {
  id: string
  warga_id: string
  saldo: number
  total_setoran: number
  total_penarikan: number
  updated_at: string
}

export interface JadwalPengangkutan {
  id: string
  hari: string
  waktu_mulai: string
  waktu_selesai: string
  jenis_sampah: string
  lokasi?: string
  is_active: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Pengumuman {
  id: string
  judul: string
  isi: string
  kategori?: 'umum' | 'kegiatan' | 'iuran' | 'bank_sampah' | 'penting'
  prioritas: 'rendah' | 'normal' | 'tinggi' | 'urgent'
  is_pinned: boolean
  tanggal_publikasi: string
  tanggal_kadaluarsa?: string
  created_by?: string
  created_at: string
  updated_at: string
}

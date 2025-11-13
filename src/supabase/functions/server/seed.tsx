/**
 * Seed Data Script untuk Development/Testing
 * 
 * Script ini tidak dijalankan otomatis. Ini adalah referensi untuk membuat
 * data awal menggunakan API endpoints yang sudah ada.
 * 
 * Untuk menggunakan script ini:
 * 1. Login sebagai admin
 * 2. Panggil endpoint-endpoint berikut dengan data contoh
 */

// ============================================
// SAMPLE DATA
// ============================================

export const sampleData = {
  // Admin account (harus dibuat via register)
  admin: {
    role: "admin",
    namaLengkap: "Admin RT 001",
    email: "admin@rt001.com",
    username: "admin",
    password: "admin123",
  },

  // Sample Warga
  warga: [
    {
      role: "warga",
      namaLengkap: "Budi Santoso",
      email: "budi@example.com",
      username: "budi123",
      password: "password123",
      nomorRumah: "01",
      blok: "A",
      noTelepon: "081234567890",
    },
    {
      role: "warga",
      namaLengkap: "Siti Nurhaliza",
      email: "siti@example.com",
      username: "siti123",
      password: "password123",
      nomorRumah: "02",
      blok: "A",
      noTelepon: "081234567891",
    },
    {
      role: "warga",
      namaLengkap: "Ahmad Yani",
      email: "ahmad@example.com",
      username: "ahmad123",
      password: "password123",
      nomorRumah: "03",
      blok: "B",
      noTelepon: "081234567892",
    },
    {
      role: "warga",
      namaLengkap: "Dewi Lestari",
      email: "dewi@example.com",
      username: "dewi123",
      password: "password123",
      nomorRumah: "04",
      blok: "B",
      noTelepon: "081234567893",
    },
    {
      role: "warga",
      namaLengkap: "Rudi Hartono",
      email: "rudi@example.com",
      username: "rudi123",
      password: "password123",
      nomorRumah: "05",
      blok: "C",
      noTelepon: "081234567894",
    },
  ],

  // Sample Petugas
  petugas: [
    {
      namaLengkap: "Andi Wijaya",
      email: "andi@example.com",
      username: "petugas",
      password: "petugas123",
      noTelepon: "081234567895",
    },
  ],

  // Sample Harga Sampah
  hargaSampah: [
    {
      jenisSampah: "Plastik PET",
      kategori: "Plastik",
      hargaPerKg: 3000,
      satuan: "kg",
    },
    {
      jenisSampah: "Plastik PP",
      kategori: "Plastik",
      hargaPerKg: 2500,
      satuan: "kg",
    },
    {
      jenisSampah: "Kertas HVS",
      kategori: "Kertas",
      hargaPerKg: 1500,
      satuan: "kg",
    },
    {
      jenisSampah: "Kardus",
      kategori: "Kertas",
      hargaPerKg: 1200,
      satuan: "kg",
    },
    {
      jenisSampah: "Kaleng Alumunium",
      kategori: "Logam",
      hargaPerKg: 5000,
      satuan: "kg",
    },
    {
      jenisSampah: "Besi",
      kategori: "Logam",
      hargaPerKg: 3500,
      satuan: "kg",
    },
    {
      jenisSampah: "Botol Kaca",
      kategori: "Kaca",
      hargaPerKg: 500,
      satuan: "kg",
    },
  ],

  // Sample Jadwal Pengangkutan
  jadwal: [
    {
      hari: "Senin",
      waktu: "07:00",
      jenisSampah: "Sampah Organik",
      blok: "Semua",
    },
    {
      hari: "Rabu",
      waktu: "07:00",
      jenisSampah: "Sampah Anorganik",
      blok: "Semua",
    },
    {
      hari: "Jumat",
      waktu: "07:00",
      jenisSampah: "Sampah Organik",
      blok: "Semua",
    },
    {
      hari: "Sabtu",
      waktu: "08:00",
      jenisSampah: "Bank Sampah",
      blok: "Semua",
    },
  ],

  // Sample Informasi RT
  informasi: [
    {
      judul: "Selamat Datang di Sistem Informasi RT",
      konten: "Sistem ini memudahkan warga untuk mengelola iuran bulanan, bank sampah, dan informasi RT. Silakan hubungi admin jika ada pertanyaan.",
      kategori: "Pengumuman",
      prioritas: "tinggi",
    },
    {
      judul: "Jadwal Rapat RT Bulan Ini",
      konten: "Rapat RT akan dilaksanakan pada hari Minggu, 15 Januari 2025 pukul 09:00 WIB di Balai RT. Kehadiran warga diharapkan.",
      kategori: "Pengumuman",
      prioritas: "tinggi",
    },
    {
      judul: "Cara Setor Sampah ke Bank Sampah",
      konten: "1. Pisahkan sampah berdasarkan jenisnya\n2. Bawa ke Pos Bank Sampah setiap hari Sabtu\n3. Petugas akan menimbang dan mencatat\n4. Saldo otomatis ditambahkan ke akun Anda",
      kategori: "Panduan",
      prioritas: "normal",
    },
    {
      judul: "Tata Cara Pembayaran Iuran",
      konten: "Pembayaran iuran dapat dilakukan melalui:\n1. QRIS (scan di halaman iuran)\n2. Transfer Bank (lihat detail di halaman iuran)\n3. Tunai ke Bendahara RT",
      kategori: "Panduan",
      prioritas: "normal",
    },
  ],

  // Sample Iuran (untuk periode bulan ini)
  getIuranSample: (wargaIds: string[]) => {
    const currentMonth = new Date().toISOString().substring(0, 7);
    return wargaIds.map((wargaId, index) => ({
      wargaId,
      periode: currentMonth,
      jumlah: 50000,
      status: index % 3 === 0 ? "lunas" : "belum_bayar",
      metodePembayaran: index % 3 === 0 ? "QRIS" : null,
    }));
  },

  // Sample Setoran
  getSetoranSample: (wargaIds: string[], petugasId: string) => {
    return [
      {
        wargaId: wargaIds[0],
        items: [
          {
            jenisSampah: "Plastik PET",
            berat: 2.5,
            hargaPerKg: 3000,
            totalHarga: 7500,
          },
          {
            jenisSampah: "Kardus",
            berat: 5.0,
            hargaPerKg: 1200,
            totalHarga: 6000,
          },
        ],
      },
      {
        wargaId: wargaIds[1],
        items: [
          {
            jenisSampah: "Kertas HVS",
            berat: 3.0,
            hargaPerKg: 1500,
            totalHarga: 4500,
          },
        ],
      },
      {
        wargaId: wargaIds[2],
        items: [
          {
            jenisSampah: "Kaleng Alumunium",
            berat: 1.5,
            hargaPerKg: 5000,
            totalHarga: 7500,
          },
          {
            jenisSampah: "Botol Kaca",
            berat: 10.0,
            hargaPerKg: 500,
            totalHarga: 5000,
          },
        ],
      },
    ];
  },
};

// ============================================
// SEED INSTRUCTIONS
// ============================================

export const seedInstructions = `
CARA SEEDING DATA:

1. Register Admin:
   POST /auth/register
   Body: sampleData.admin

2. Login sebagai Admin untuk mendapatkan access token

3. Create Warga (loop untuk semua warga):
   POST /auth/register
   Body: sampleData.warga[i]

4. Create Petugas:
   POST /petugas
   Body: sampleData.petugas[0]
   Headers: Authorization: Bearer {adminToken}

5. Create Harga Sampah (loop):
   POST /harga-sampah
   Body: sampleData.hargaSampah[i]
   Headers: Authorization: Bearer {adminToken}

6. Create Jadwal (loop):
   POST /jadwal
   Body: sampleData.jadwal[i]
   Headers: Authorization: Bearer {adminToken}

7. Create Informasi (loop):
   POST /informasi
   Body: sampleData.informasi[i]
   Headers: Authorization: Bearer {adminToken}

8. Create Iuran untuk semua warga:
   POST /iuran
   Body: sampleData.getIuranSample(wargaIds)[i]
   Headers: Authorization: Bearer {adminToken}

9. Create Setoran (login sebagai petugas dulu):
   POST /setoran
   Body: sampleData.getSetoranSample(wargaIds, petugasId)[i]
   Headers: Authorization: Bearer {petugasToken}

CATATAN:
- Simpan userId dari setiap warga yang dibuat untuk digunakan dalam iuran dan setoran
- Gunakan access token yang sesuai dengan role untuk setiap operasi
- Data ini hanya untuk development/testing
`;

// Export untuk digunakan di file lain jika diperlukan
export default sampleData;

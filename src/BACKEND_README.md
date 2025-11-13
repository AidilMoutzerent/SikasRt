# Backend Sistem Informasi Warga RT

Backend API lengkap untuk aplikasi Sistem Informasi Warga RT menggunakan **Supabase Edge Functions** dengan **Hono** framework.

## 📚 Dokumentasi

- **[API Documentation](./API_DOCUMENTATION.md)** - Dokumentasi lengkap semua endpoints
- **[Integration Guide](./INTEGRATION_GUIDE.md)** - Panduan integrasi backend dengan frontend
- **[Manual Testing Guide](./TEST_API.md)** - Panduan testing API secara manual

## 🎯 Fitur Backend

### 1. **Autentikasi Multi-Role**
- ✅ Registrasi untuk Warga dan Admin
- ✅ Login untuk Warga, Admin, dan Petugas
- ✅ Session management dengan JWT tokens
- ✅ Role-based access control (RBAC)
- ✅ Auto-confirm email (development mode)

### 2. **Manajemen Warga**
- ✅ CRUD warga (Admin only)
- ✅ Filter warga by blok
- ✅ Status aktif/nonaktif
- ✅ Data profil lengkap (nama, email, nomor rumah, blok, telepon)

### 3. **Manajemen Iuran**
- ✅ Create/update iuran per warga per periode
- ✅ Status pembayaran (belum_bayar, lunas, terlambat)
- ✅ Metode pembayaran (QRIS, Transfer Bank, Tunai)
- ✅ Riwayat pembayaran
- ✅ Upload bukti pembayaran

### 4. **Bank Sampah**
- ✅ CRUD harga sampah per jenis (Admin only)
- ✅ Kategori sampah (Plastik, Kertas, Logam, Kaca, dll)
- ✅ Input setoran oleh Petugas
- ✅ Kalkulasi otomatis saldo per warga
- ✅ Riwayat setoran
- ✅ Laporan bank sampah

### 5. **Jadwal Pengangkutan**
- ✅ CRUD jadwal pengangkutan (Admin only)
- ✅ Jadwal per hari, waktu, jenis sampah, dan blok
- ✅ List jadwal untuk semua user

### 6. **Informasi RT**
- ✅ CRUD informasi/pengumuman (Admin only)
- ✅ Kategori (Pengumuman, Panduan, Kegiatan, dll)
- ✅ Prioritas (tinggi, normal, rendah)
- ✅ List informasi untuk semua user

### 7. **Manajemen Petugas**
- ✅ CRUD petugas bank sampah (Admin only)
- ✅ Status aktif/nonaktif

### 8. **Dashboard Statistics**
- ✅ Stats untuk Admin (total warga, iuran, pendapatan, setoran)
- ✅ Stats untuk Warga (saldo bank sampah, status iuran, total setoran)
- ✅ Stats untuk Petugas (total setoran diproses, berat, nilai)

## 🏗️ Struktur Backend

```
/supabase/functions/server/
├── index.tsx              # Main server dengan semua endpoints
├── kv_store.tsx          # KV Store utilities (PROTECTED)
└── seed.tsx              # Sample data untuk development

/utils/
└── api.ts                # API helper functions & type-safe calls

/hooks/
├── useAuth.ts            # Hook untuk autentikasi
├── useWarga.ts           # Hook untuk data warga
├── useHargaSampah.ts     # Hook untuk harga sampah
└── useDashboard.ts       # Hook untuk dashboard stats
```

## 🔑 Key Structure di KV Store

Data disimpan dengan struktur key yang terorganisir:

```
user:{userId}                    # User account data
user:email:{email}               # Email to userId mapping
user:username:{username}         # Username to userId mapping
warga:{wargaId}                  # Warga profile data
iuran:{wargaId}:{periode}       # Iuran per warga per periode
harga_sampah:{jenisId}          # Harga sampah per jenis
setoran:{setoranId}             # Setoran bank sampah
jadwal:{jadwalId}               # Jadwal pengangkutan
informasi:{infoId}              # Informasi RT
petugas:{petugasId}             # Petugas data
saldo_bank_sampah:{wargaId}     # Saldo bank sampah per warga
```

## 🚀 Quick Start

### 1. Backend sudah terkonfigurasi dan siap digunakan

Tidak perlu setup tambahan, backend sudah berjalan di Supabase Edge Functions.

### 2. Testing Backend

#### Manual Testing (cURL/Postman):
Lihat [TEST_API.md](./TEST_API.md)

#### Automated Testing:
```bash
# Health check
curl https://{projectId}.supabase.co/functions/v1/make-server-784cdc32/health
```

### 3. Integrasi dengan Frontend

Lihat [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) untuk panduan lengkap.

**Quick Example:**

```tsx
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, login, logout } = useAuth();

  if (!user) {
    return <LoginPage onLogin={login} />;
  }

  return <Dashboard user={user} onLogout={logout} />;
}
```

## 📡 API Endpoints Overview

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Warga Management (Admin)
- `GET /warga` - Get all warga
- `GET /warga/:id` - Get warga by ID
- `PUT /warga/:id` - Update warga
- `DELETE /warga/:id` - Delete warga

### Iuran
- `GET /iuran` - Get all iuran (Admin)
- `GET /iuran/:wargaId` - Get iuran by warga
- `POST /iuran` - Create/update iuran (Admin)
- `PUT /iuran/:wargaId/:periode` - Update iuran status

### Bank Sampah
- `GET /harga-sampah` - Get all harga sampah
- `POST /harga-sampah` - Create harga sampah (Admin)
- `PUT /harga-sampah/:id` - Update harga sampah (Admin)
- `DELETE /harga-sampah/:id` - Delete harga sampah (Admin)

### Setoran
- `GET /setoran` - Get all setoran
- `POST /setoran` - Create setoran (Petugas)
- `GET /saldo/:wargaId` - Get saldo bank sampah

### Jadwal
- `GET /jadwal` - Get all jadwal
- `POST /jadwal` - Create jadwal (Admin)
- `PUT /jadwal/:id` - Update jadwal (Admin)
- `DELETE /jadwal/:id` - Delete jadwal (Admin)

### Informasi RT
- `GET /informasi` - Get all informasi
- `POST /informasi` - Create informasi (Admin)
- `PUT /informasi/:id` - Update informasi (Admin)
- `DELETE /informasi/:id` - Delete informasi (Admin)

### Petugas (Admin)
- `GET /petugas` - Get all petugas
- `POST /petugas` - Create petugas
- `PUT /petugas/:id` - Update petugas
- `DELETE /petugas/:id` - Delete petugas

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics (role-based)

## 🔐 Security

### Authentication & Authorization
- ✅ JWT-based authentication dengan Supabase Auth
- ✅ Role-based access control (Admin, Warga, Petugas)
- ✅ Protected endpoints dengan middleware verification
- ✅ Password hashing dengan SHA-256
- ✅ Token validation pada setiap request

### Best Practices
- ✅ Input validation pada semua endpoints
- ✅ Error handling dengan detailed messages
- ✅ CORS configured untuk semua origins (development mode)
- ✅ Service Role Key tidak leak ke frontend
- ✅ Auto-confirm email (development - disable di production)

### ⚠️ Production Considerations
Untuk production deployment:
1. **Email Verification**: Setup email service dan disable auto-confirm
2. **CORS**: Restrict ke domain specific
3. **Rate Limiting**: Implement rate limiting untuk prevent abuse
4. **Input Sanitization**: Add additional validation
5. **Logging**: Implement comprehensive logging
6. **Monitoring**: Setup monitoring dan alerting
7. **Backup**: Regular backup KV Store data
8. **HTTPS**: Ensure all communications over HTTPS

## 🎨 Frontend Integration

### Using React Hooks

```tsx
// Authentication
import { useAuth } from './hooks/useAuth';
const { user, login, logout } = useAuth();

// Warga Management
import { useWarga } from './hooks/useWarga';
const { warga, updateWarga, deleteWarga } = useWarga();

// Harga Sampah
import { useHargaSampah } from './hooks/useHargaSampah';
const { hargaSampah, createHargaSampah } = useHargaSampah();

// Dashboard
import { useDashboard } from './hooks/useDashboard';
const { stats } = useDashboard();
```

### Direct API Calls

```tsx
import { iuranAPI, setoranAPI, jadwalAPI, informasiAPI } from './utils/api';

// Create iuran
await iuranAPI.create({
  wargaId: 'uuid',
  periode: '2025-01',
  jumlah: 50000,
});

// Create setoran
await setoranAPI.create({
  wargaId: 'uuid',
  items: [{ jenisSampah: 'Plastik PET', berat: 2.5, hargaPerKg: 3000, totalHarga: 7500 }]
});
```

## 📊 Data Models

### User
```typescript
{
  id: string;
  role: 'admin' | 'warga' | 'petugas';
  username: string;
  email: string;
  namaLengkap: string;
  createdAt: string;
}
```

### Warga
```typescript
{
  id: string;
  userId: string;
  namaLengkap: string;
  email: string;
  username: string;
  nomorRumah: string;
  blok: string;
  noTelepon: string;
  statusAktif: boolean;
  createdAt: string;
}
```

### Iuran
```typescript
{
  id: string;
  wargaId: string;
  periode: string; // 'YYYY-MM'
  jumlah: number;
  status: 'belum_bayar' | 'lunas' | 'terlambat';
  metodePembayaran?: string;
  buktiPembayaran?: string;
  paidAt?: string;
  createdAt: string;
}
```

### Setoran
```typescript
{
  id: string;
  wargaId: string;
  petugasId: string;
  items: Array<{
    jenisSampah: string;
    berat: number;
    hargaPerKg: number;
    totalHarga: number;
  }>;
  totalBerat: number;
  totalHarga: number;
  tanggal: string;
  createdAt: string;
}
```

## 🧪 Sample Data

Lihat `/supabase/functions/server/seed.tsx` untuk sample data yang bisa digunakan untuk testing.

Sample data includes:
- 1 Admin account
- 5 Warga accounts (berbeda blok)
- 1 Petugas account
- 7 Jenis harga sampah
- 4 Jadwal pengangkutan
- 4 Informasi RT

## 🐛 Debugging

### Server Logs
Check logs di Supabase Dashboard → Edge Functions → Logs

### Common Issues

**401 Unauthorized:**
- Check apakah Authorization header sudah benar
- Verify token masih valid (belum expired)
- Pastikan menggunakan Bearer token format

**403 Forbidden:**
- Check role user apakah sesuai dengan endpoint requirement
- Admin-only endpoints hanya bisa diakses oleh admin

**404 Not Found:**
- Verify ID yang digunakan sudah benar
- Check apakah data memang exist di KV Store

**500 Internal Server Error:**
- Check server logs untuk detail error
- Verify semua required fields sudah terisi

## 📈 Performance

- **KV Store**: Fast key-value operations
- **Prefix Queries**: Efficient untuk list operations
- **JWT Tokens**: Stateless authentication
- **Edge Functions**: Global deployment untuk low latency

## 🔄 Future Enhancements

Beberapa enhancement yang bisa ditambahkan:

1. **Notifications**: Push notifications untuk pengumuman
2. **File Upload**: Storage untuk bukti pembayaran & dokumen
3. **Real-time**: Supabase Realtime untuk update live
4. **Analytics**: Detailed analytics dashboard
5. **Export**: Export data ke PDF/Excel
6. **Batch Operations**: Bulk create/update iuran
7. **Search**: Full-text search untuk warga & informasi
8. **Audit Log**: Track semua changes
9. **Email Notifications**: Email untuk reminder iuran
10. **Mobile App**: React Native integration

## 📞 Support

Untuk pertanyaan atau masalah:
1. Check dokumentasi yang relevan
2. Review error messages di console
3. Check server logs di Supabase Dashboard
4. Test endpoints manual dengan curl/Postman

## 📄 License

This backend is part of Sistem Informasi Warga RT application.

---

**Built with ❤️ using:**
- Supabase Edge Functions
- Hono Framework
- Deno Runtime
- TypeScript

**Happy Coding! 🚀**

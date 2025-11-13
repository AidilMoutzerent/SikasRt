# Integration Guide - Backend dengan Frontend

Panduan lengkap untuk mengintegrasikan backend Supabase dengan aplikasi frontend React.

## 📋 Daftar Isi

1. [Setup Awal](#setup-awal)
2. [Autentikasi](#autentikasi)
3. [Menggunakan Hooks](#menggunakan-hooks)
4. [Contoh Integrasi per Halaman](#contoh-integrasi-per-halaman)
5. [Error Handling](#error-handling)
6. [Best Practices](#best-practices)

---

## 🚀 Setup Awal

### 1. File yang Sudah Dibuat

Backend sudah disetup dengan file-file berikut:

```
/supabase/functions/server/
  ├── index.tsx              # Main server dengan semua endpoints
  ├── kv_store.tsx          # KV Store utilities (PROTECTED - jangan edit)
  └── seed.tsx              # Sample data untuk testing

/utils/
  └── api.ts                # API helper functions

/hooks/
  ├── useAuth.ts            # Hook untuk autentikasi
  ├── useWarga.ts           # Hook untuk data warga
  ├── useHargaSampah.ts     # Hook untuk harga sampah
  └── useDashboard.ts       # Hook untuk dashboard stats
```

### 2. Environment Variables

Tidak perlu setup environment variables karena sudah menggunakan `/utils/supabase/info.tsx` yang sudah ada.

---

## 🔐 Autentikasi

### Mengintegrasikan `useAuth` Hook

Update `/App.tsx` untuk menggunakan backend autentikasi:

```tsx
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { user, loading, isAuthenticated, login, logout } = useAuth();

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  // Render based on user role
  if (user?.role === 'admin') {
    return <AdminPanel />;
  } else if (user?.role === 'petugas') {
    return <PetugasPanel />;
  } else {
    return <WargaPanel />;
  }
}
```

### Update Login Page

Update `/components/pages/login-page.tsx`:

```tsx
import { useAuth } from '../../hooks/useAuth';

export function LoginPage() {
  const { login, register, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await login(
      formData.username,
      formData.password,
      selectedRole
    );

    // Login success akan otomatis redirect via useAuth
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await register({
      role: selectedRole,
      namaLengkap: registerData.namaLengkap,
      email: registerData.email,
      username: registerData.username,
      password: registerData.password,
      nomorRumah: registerData.nomorRumah,
      blok: registerData.blok,
      noTelepon: registerData.noTelepon,
    });

    if (result.success) {
      // Switch to login mode
      setIsRegisterMode(false);
    }
  };

  // ... rest of component
}
```

---

## 🎣 Menggunakan Hooks

### 1. useWarga - Manajemen Data Warga

```tsx
import { useWarga } from '../../hooks/useWarga';

export function ManajemenWargaPage() {
  const { warga, loading, updateWarga, deleteWarga } = useWarga();

  const handleEdit = async (id: string, data: any) => {
    await updateWarga(id, data);
    // Toast notification otomatis muncul
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus?')) {
      await deleteWarga(id);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {warga.map(w => (
        <WargaCard
          key={w.id}
          warga={w}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
```

### 2. useHargaSampah - Manajemen Harga Sampah

```tsx
import { useHargaSampah } from '../../../hooks/useHargaSampah';

export function HargaSampahList() {
  const {
    hargaSampah,
    loading,
    createHargaSampah,
    updateHargaSampah,
    deleteHargaSampah
  } = useHargaSampah();

  const handleCreate = async (data: any) => {
    await createHargaSampah({
      jenisSampah: data.jenisSampah,
      kategori: data.kategori,
      hargaPerKg: parseFloat(data.hargaPerKg),
      satuan: data.satuan || 'kg',
    });
  };

  // ... rest of component
}
```

### 3. useDashboard - Dashboard Statistics

```tsx
import { useDashboard } from '../../hooks/useDashboard';

export function DashboardPage() {
  const { stats, loading, fetchStats } = useDashboard();

  useEffect(() => {
    fetchStats(); // Refresh stats
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Display stats based on user role */}
      {stats && 'totalWarga' in stats && (
        <AdminDashboard stats={stats} />
      )}
      {stats && 'saldoBankSampah' in stats && (
        <WargaDashboard stats={stats} />
      )}
    </div>
  );
}
```

---

## 📄 Contoh Integrasi per Halaman

### 1. Dashboard Page (Warga)

```tsx
import { useState, useEffect } from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { iuranAPI, setoranAPI } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';

export function DashboardPage() {
  const { user } = useAuth();
  const { stats, loading } = useDashboard();
  const [iuranBulanIni, setIuranBulanIni] = useState(null);

  useEffect(() => {
    const fetchIuran = async () => {
      if (user?.id) {
        const response = await iuranAPI.getByWarga(user.id);
        // Get current month iuran
        const currentMonth = new Date().toISOString().substring(0, 7);
        const currentIuran = response.iuran.find(i => i.periode === currentMonth);
        setIuranBulanIni(currentIuran);
      }
    };
    fetchIuran();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard Warga</h1>
      
      {/* Status Iuran */}
      <StatusIuranCard iuran={iuranBulanIni} />
      
      {/* Saldo Bank Sampah */}
      <BankSampahCard saldo={stats?.saldoBankSampah || 0} />
      
      {/* Quick Info */}
      <QuickInfoSection />
    </div>
  );
}
```

### 2. Riwayat Iuran Page (Warga)

```tsx
import { useState, useEffect } from 'react';
import { iuranAPI } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';

export function RiwayatIuranPage() {
  const { user } = useAuth();
  const [iuran, setIuran] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIuran = async () => {
      if (user?.id) {
        const response = await iuranAPI.getByWarga(user.id);
        setIuran(response.iuran);
      }
      setLoading(false);
    };
    fetchIuran();
  }, [user]);

  const handleBayar = async (periode: string, metodePembayaran: string) => {
    if (user?.id) {
      await iuranAPI.update(user.id, periode, {
        status: 'lunas',
        metodePembayaran,
        buktiPembayaran: 'base64-or-url', // Upload bukti pembayaran
      });
      
      // Refresh data
      const response = await iuranAPI.getByWarga(user.id);
      setIuran(response.iuran);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {iuran.map(i => (
        <IuranCard
          key={i.id}
          iuran={i}
          onBayar={handleBayar}
        />
      ))}
    </div>
  );
}
```

### 3. Bank Sampah Page (Warga)

```tsx
import { useState, useEffect } from 'react';
import { useHargaSampah } from '../../hooks/useHargaSampah';
import { setoranAPI } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';

export function BankSampahPage() {
  const { user } = useAuth();
  const { hargaSampah } = useHargaSampah();
  const [setoran, setSetoran] = useState([]);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        // Get setoran history
        const setoranResponse = await setoranAPI.getAll(user.id);
        setSetoran(setoranResponse.setoran);
        
        // Get saldo
        const saldoResponse = await setoranAPI.getSaldo(user.id);
        setSaldo(saldoResponse.saldo.saldo);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div>
      <h1>Bank Sampah</h1>
      
      {/* Saldo Display */}
      <div>Saldo: Rp {saldo.toLocaleString()}</div>
      
      {/* Harga Sampah List */}
      <div>
        <h2>Daftar Harga Sampah</h2>
        {hargaSampah.map(h => (
          <div key={h.id}>
            {h.jenisSampah}: Rp {h.hargaPerKg.toLocaleString()}/{h.satuan}
          </div>
        ))}
      </div>
      
      {/* Riwayat Setoran */}
      <div>
        <h2>Riwayat Setoran</h2>
        {setoran.map(s => (
          <SetoranCard key={s.id} setoran={s} />
        ))}
      </div>
    </div>
  );
}
```

### 4. Input Setoran Page (Petugas)

```tsx
import { useState } from 'react';
import { useHargaSampah } from '../../../hooks/useHargaSampah';
import { useWarga } from '../../../hooks/useWarga';
import { setoranAPI } from '../../../utils/api';

export function InputSetoranPage() {
  const { hargaSampah } = useHargaSampah();
  const { warga } = useWarga();
  const [selectedWarga, setSelectedWarga] = useState('');
  const [items, setItems] = useState([]);

  const handleSubmit = async () => {
    const result = await setoranAPI.create({
      wargaId: selectedWarga,
      items: items.map(item => ({
        jenisSampah: item.jenisSampah,
        berat: parseFloat(item.berat),
        hargaPerKg: parseFloat(item.hargaPerKg),
        totalHarga: parseFloat(item.berat) * parseFloat(item.hargaPerKg),
      })),
    });

    toast.success(`Setoran berhasil! Saldo baru: Rp ${result.saldoBaru.toLocaleString()}`);
    
    // Reset form
    setItems([]);
    setSelectedWarga('');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Pilih Warga */}
      <select value={selectedWarga} onChange={(e) => setSelectedWarga(e.target.value)}>
        <option value="">Pilih Warga</option>
        {warga.map(w => (
          <option key={w.id} value={w.id}>
            {w.namaLengkap} - {w.blok}/{w.nomorRumah}
          </option>
        ))}
      </select>

      {/* Input Items */}
      {/* ... form untuk input sampah */}

      <button type="submit">Simpan Setoran</button>
    </form>
  );
}
```

### 5. Manajemen Warga Page (Admin)

```tsx
import { useWarga } from '../../../hooks/useWarga';
import { useState } from 'react';

export function ManajemenWargaPage() {
  const { warga, loading, updateWarga, deleteWarga } = useWarga();
  const [filter, setFilter] = useState({ blok: '', status: 'all' });

  const filteredWarga = warga.filter(w => {
    if (filter.blok && w.blok !== filter.blok) return false;
    if (filter.status === 'active' && !w.statusAktif) return false;
    if (filter.status === 'inactive' && w.statusAktif) return false;
    return true;
  });

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await updateWarga(id, { statusAktif: !currentStatus });
  };

  return (
    <div>
      <h1>Manajemen Warga</h1>
      
      {/* Filters */}
      <div>
        <select value={filter.blok} onChange={(e) => setFilter({...filter, blok: e.target.value})}>
          <option value="">Semua Blok</option>
          <option value="A">Blok A</option>
          <option value="B">Blok B</option>
          <option value="C">Blok C</option>
          <option value="D">Blok D</option>
        </select>
      </div>

      {/* Warga Table */}
      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Blok/No</th>
            <th>Email</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredWarga.map(w => (
            <tr key={w.id}>
              <td>{w.namaLengkap}</td>
              <td>{w.blok}/{w.nomorRumah}</td>
              <td>{w.email}</td>
              <td>{w.statusAktif ? 'Aktif' : 'Nonaktif'}</td>
              <td>
                <button onClick={() => handleToggleStatus(w.id, w.statusAktif)}>
                  Toggle Status
                </button>
                <button onClick={() => deleteWarga(w.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## ⚠️ Error Handling

### 1. Menangani Error di Hook

Semua hook sudah memiliki error handling built-in dengan toast notifications. Namun untuk custom handling:

```tsx
const { warga, error } = useWarga();

if (error) {
  return <ErrorDisplay message={error} />;
}
```

### 2. Try-Catch untuk API Calls

```tsx
const handleAction = async () => {
  try {
    await someAPI.action();
    toast.success('Berhasil!');
  } catch (error) {
    console.error('Action failed:', error);
    toast.error('Gagal melakukan aksi');
  }
};
```

### 3. Loading States

```tsx
const { data, loading } = useSomeHook();

if (loading) {
  return <Skeleton />;
}
```

---

## ✨ Best Practices

### 1. Gunakan Hooks untuk Data Fetching

✅ **Good:**
```tsx
const { warga, loading } = useWarga();
```

❌ **Bad:**
```tsx
const [warga, setWarga] = useState([]);
useEffect(() => {
  fetch('/api/warga').then(...)
}, []);
```

### 2. Validasi Form Sebelum Submit

```tsx
const handleSubmit = async (data) => {
  if (!data.email || !data.password) {
    toast.error('Semua field wajib diisi');
    return;
  }
  
  await api.submit(data);
};
```

### 3. Refresh Data Setelah Mutasi

```tsx
const handleDelete = async (id) => {
  await deleteAPI(id);
  await fetchData(); // Refresh
};
```

### 4. Logout saat Token Expired

```tsx
const { logout } = useAuth();

try {
  await api.call();
} catch (error) {
  if (error.message.includes('Unauthorized')) {
    logout();
  }
}
```

### 5. Optimistic Updates (Optional)

```tsx
const handleUpdate = async (id, newData) => {
  // Update UI immediately
  setData(prev => prev.map(item => 
    item.id === id ? { ...item, ...newData } : item
  ));
  
  try {
    await updateAPI(id, newData);
  } catch (error) {
    // Rollback on error
    await fetchData();
    toast.error('Update gagal');
  }
};
```

---

## 🔄 Lifecycle Integrasi

1. **User Login** → `useAuth().login()` → Save token & user data
2. **Load Page** → `useAuth()` check saved data → Fetch user from API
3. **Fetch Data** → Use hooks (`useWarga`, `useHargaSampah`, etc.)
4. **Mutate Data** → Call API → Show toast → Refresh data
5. **User Logout** → `useAuth().logout()` → Clear token & redirect

---

## 📝 Checklist Integrasi

- [ ] Update `App.tsx` dengan `useAuth` hook
- [ ] Update `LoginPage` untuk gunakan backend login/register
- [ ] Integrasikan dashboard dengan `useDashboard` hook
- [ ] Update halaman warga dengan `useAuth` untuk data user
- [ ] Integrasikan manajemen warga dengan `useWarga` hook
- [ ] Integrasikan bank sampah dengan `useHargaSampah` hook
- [ ] Integrasikan input setoran dengan `setoranAPI`
- [ ] Integrasikan riwayat iuran dengan `iuranAPI`
- [ ] Test semua fitur dengan data real dari backend
- [ ] Add loading states untuk semua async operations
- [ ] Add error handling untuk semua API calls

---

## 🆘 Troubleshooting

### Token Expired
**Problem:** API call returns 401 Unauthorized
**Solution:** Call `logout()` untuk clear token dan redirect ke login

### Data tidak muncul
**Problem:** Hook tidak fetch data
**Solution:** Check console untuk error messages, pastikan authentication token valid

### CORS Error
**Problem:** Browser blocks request
**Solution:** Server sudah configured untuk open CORS, check browser console

### Type Errors
**Problem:** TypeScript complaints
**Solution:** Import types dari hooks, misal `import type { Warga } from '../hooks/useWarga'`

---

Selamat mengintegrasikan! 🚀

# Cara Menggunakan Services di Komponen React

## Struktur Dasar

Setiap komponen React yang ingin menggunakan Supabase harus:

### 1. Import di Bagian Atas File

```typescript
// Di bagian PALING ATAS file komponen, tambahkan import
import { useState, useEffect } from 'react'
import { authService } from '../../services/auth.service'
// atau
import { iuranService } from '../../services/iuran.service'
import { bankSampahService } from '../../services/bank-sampah.service'
import { pembayaranService } from '../../services/pembayaran.service'
```

### 2. Contoh Komponen Lengkap

**File: `/components/pages/example-page.tsx`**

```typescript
// ========== 1. IMPORTS (PALING ATAS) ==========
import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { toast } from 'react-toastify'
// Import services
import { iuranService } from '../../services/iuran.service'
import { authService } from '../../services/auth.service'

// ========== 2. COMPONENT ==========
export function ExamplePage() {
  // State untuk menyimpan data
  const [iuranList, setIuranList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  // useEffect untuk fetch data saat component mount
  useEffect(() => {
    loadIuran()
  }, [])
  
  // Function untuk load data
  const loadIuran = async () => {
    setIsLoading(true)
    try {
      const result = await iuranService.getMyIuran()
      if (result.success) {
        setIuranList(result.data)
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Gagal memuat data')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Render UI
  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {iuranList.map((iuran) => (
            <div key={iuran.id}>
              {/* Tampilkan data iuran */}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

## Pola Penggunaan Services

### Pattern 1: Fetch Data saat Component Load

```typescript
import { useState, useEffect } from 'react'
import { iuranService } from '../../services/iuran.service'

export function MyComponent() {
  const [data, setData] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await iuranService.getMyIuran()
      if (result.success) {
        setData(result.data)
      }
    }
    
    fetchData()
  }, []) // [] = run once saat mount
  
  return <div>...</div>
}
```

### Pattern 2: Submit Form (Create/Update)

```typescript
import { useState } from 'react'
import { pembayaranService } from '../../services/pembayaran.service'
import { toast } from 'react-toastify'

export function BayarForm() {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const result = await pembayaranService.bayarIuran({
        iuran_id: '123',
        jumlah_bayar: 50000,
        nomor_referensi: 'BRI001',
      })
      
      if (result.success) {
        toast.success('Pembayaran berhasil!')
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Gagal memproses pembayaran')
    } finally {
      setIsLoading(false)
    }
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

### Pattern 3: Fetch Data dengan Filter

```typescript
import { useState, useEffect } from 'react'
import { iuranService } from '../../services/iuran.service'

export function FilteredData() {
  const [data, setData] = useState([])
  const [bulan, setBulan] = useState(11)
  const [tahun, setTahun] = useState(2025)
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await iuranService.getIuranByPeriod(bulan, tahun)
      if (result.success) {
        setData(result.data)
      }
    }
    
    fetchData()
  }, [bulan, tahun]) // Re-fetch saat bulan/tahun berubah
  
  return <div>...</div>
}
```

## Lokasi Import Berdasarkan Fitur

### Authentication
```typescript
import { authService } from '../../services/auth.service'

// Tersedia:
// - authService.register(data)
// - authService.login(data)
// - authService.logout()
// - authService.getCurrentUser()
```

### Iuran
```typescript
import { iuranService } from '../../services/iuran.service'

// Tersedia:
// - iuranService.getMyIuran()
// - iuranService.getIuranByPeriod(bulan, tahun)
// - iuranService.getAllIuran(filters) // Admin only
// - iuranService.createIuran(data) // Admin only
// - iuranService.createBulkIuran(data) // Admin only
```

### Pembayaran
```typescript
import { pembayaranService } from '../../services/pembayaran.service'

// Tersedia:
// - pembayaranService.bayarIuran(data)
// - pembayaranService.getMyPembayaran()
// - pembayaranService.getAllPembayaran(filters) // Admin only
// - pembayaranService.verifyPembayaran(id, action, catatan) // Admin only
```

### Bank Sampah
```typescript
import { bankSampahService } from '../../services/bank-sampah.service'

// Tersedia:
// - bankSampahService.getMySaldo()
// - bankSampahService.getJenisSampah()
// - bankSampahService.getMySetoran()
// - bankSampahService.ajukanPenarikan(data)
// - bankSampahService.inputSetoran(data) // Petugas only
// - bankSampahService.approvePenarikan(id, action) // Admin only
```

## Struktur Folder

```
/
├── src/
│   ├── lib/
│   │   └── supabase.ts          ← Supabase client (jangan import langsung!)
│   ├── services/
│   │   ├── auth.service.ts      ← Import ini untuk auth
│   │   ├── iuran.service.ts     ← Import ini untuk iuran
│   │   ├── pembayaran.service.ts
│   │   └── bank-sampah.service.ts
│   └── components/
│       └── pages/
│           └── your-page.tsx    ← Import services di sini
```

## Error Handling

Selalu handle error dengan pattern ini:

```typescript
const handleAction = async () => {
  setIsLoading(true)
  
  try {
    const result = await someService.someMethod()
    
    if (result.success) {
      // Berhasil
      toast.success('Berhasil!')
      // Update state, dll
    } else {
      // Gagal, tapi ada error message
      toast.error(result.error || 'Terjadi kesalahan')
    }
  } catch (error: any) {
    // Unexpected error
    console.error(error)
    toast.error(error.message || 'Terjadi kesalahan')
  } finally {
    setIsLoading(false)
  }
}
```

## Loading State

Gunakan loading state untuk UX yang lebih baik:

```typescript
const [isLoading, setIsLoading] = useState(false)

// Saat fetch/submit
setIsLoading(true)
try {
  // ... fetch/submit
} finally {
  setIsLoading(false)
}

// Di render
return (
  <Button disabled={isLoading}>
    {isLoading ? 'Loading...' : 'Submit'}
  </Button>
)
```

## Contoh Real: Update Dashboard Warga

```typescript
// File: /components/pages/dashboard-page.tsx
import { useState, useEffect } from 'react'
import { iuranService } from '../../services/iuran.service'
import { bankSampahService } from '../../services/bank-sampah.service'

export function DashboardPage() {
  const [iuranBulanIni, setIuranBulanIni] = useState(null)
  const [saldo, setSaldo] = useState({ saldo: 0, total_setoran: 0, total_penarikan: 0 })
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    setIsLoading(true)
    
    try {
      // Get iuran bulan ini
      const currentDate = new Date()
      const iuranResult = await iuranService.getIuranByPeriod(
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
      )
      
      if (iuranResult.success) {
        setIuranBulanIni(iuranResult.data)
      }
      
      // Get saldo bank sampah
      const saldoResult = await bankSampahService.getMySaldo()
      if (saldoResult.success) {
        setSaldo(saldoResult.data)
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  if (isLoading) {
    return <div>Loading...</div>
  }
  
  return (
    <div>
      {/* Tampilkan iuran */}
      <div>
        <h2>Iuran Bulan Ini</h2>
        {iuranBulanIni ? (
          <p>Rp {iuranBulanIni.nominal} - {iuranBulanIni.status}</p>
        ) : (
          <p>Belum ada tagihan</p>
        )}
      </div>
      
      {/* Tampilkan saldo */}
      <div>
        <h2>Saldo Bank Sampah</h2>
        <p>Rp {saldo.saldo}</p>
      </div>
    </div>
  )
}
```

## Tips Penting

1. **Jangan import `supabase` langsung** dari `/src/lib/supabase.ts`
2. **Selalu gunakan services** yang sudah dibuat
3. **Gunakan `async/await`** untuk semua API calls
4. **Handle error dengan `try/catch`**
5. **Tambah loading state** untuk UX yang baik
6. **Check `result.success`** sebelum menggunakan data

---

**Selamat coding! 🚀**

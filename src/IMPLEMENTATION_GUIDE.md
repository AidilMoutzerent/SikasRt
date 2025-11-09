# Panduan Implementasi Fungsi Tombol - Admin Panel

## ✅ Yang Sudah Diimplementasi

### 1. Manajemen Petugas (`manajemen-petugas-page.tsx`)
**Status: COMPLETED** ✅

Fitur yang sudah berfungsi:
- ✅ Tambah petugas baru (dengan validasi)
- ✅ Edit data petugas
- ✅ Hapus petugas (dengan konfirmasi)
- ✅ Lihat detail petugas
- ✅ Hubungi via WhatsApp
- ✅ Search & Filter petugas
- ✅ Export data
- ✅ Toast notifications untuk setiap aksi

### Teknologi yang Digunakan:
```typescript
- useState untuk state management
- toast dari "sonner@2.0.3" untuk notifications
- AlertDialog untuk konfirmasi hapus
- Form state dengan controlled inputs
```

## 📝 Pattern untuk Implementasi Halaman Lain

### A. Setup Imports (Tambahkan di setiap halaman)

```typescript
import { toast } from "sonner@2.0.3";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
```

### B. State Management Pattern

```typescript
// 1. Convert data ke state
const [data, setData] = useState([initialData]);

// 2. Modal states
const [showAddModal, setShowAddModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const [showDetailModal, setShowDetailModal] = useState(false);
const [showDeleteDialog, setShowDeleteDialog] = useState(false);

// 3. Selected item state
const [selectedItem, setSelectedItem] = useState<TypeInterface | null>(null);

// 4. Search & Filter states
const [searchQuery, setSearchQuery] = useState("");
const [filterType, setFilterType] = useState("all");

// 5. Form state
const [formData, setFormData] = useState({
  field1: "",
  field2: "",
  // ... all form fields
});
```

### C. CRUD Functions Pattern

```typescript
// CREATE
const handleAdd = () => {
  if (!formData.requiredField) {
    toast.error("Mohon lengkapi data yang diperlukan!");
    return;
  }

  const newItem = {
    id: data.length + 1,
    ...formData,
    createdAt: new Date().toISOString()
  };

  setData([...data, newItem]);
  toast.success("Data berhasil ditambahkan!");
  setShowAddModal(false);
  resetForm();
};

// UPDATE
const handleUpdate = () => {
  if (!selectedItem) return;

  const updatedData = data.map(item =>
    item.id === selectedItem.id
      ? { ...item, ...formData }
      : item
  );

  setData(updatedData);
  toast.success("Data berhasil diperbarui!");
  setShowEditModal(false);
  resetForm();
};

// DELETE
const handleDelete = () => {
  if (!selectedItem) return;

  const updatedData = data.filter(item => item.id !== selectedItem.id);
  setData(updatedData);
  toast.success("Data berhasil dihapus!");
  setShowDeleteDialog(false);
  setSelectedItem(null);
};

// RESET FORM
const resetForm = () => {
  setFormData({
    field1: "",
    field2: "",
    // reset all fields
  });
  setSelectedItem(null);
};
```

### D. Action Handlers

```typescript
// View Detail
const handleViewDetail = (item) => {
  setSelectedItem(item);
  setShowDetailModal(true);
};

// Edit
const handleEdit = (item) => {
  setSelectedItem(item);
  setFormData({
    field1: item.field1,
    field2: item.field2,
    // map all fields
  });
  setShowEditModal(true);
};

// Delete Click
const handleDeleteClick = (item) => {
  setSelectedItem(item);
  setShowDeleteDialog(true);
};

// Export
const handleExport = () => {
  toast.success("Data berhasil diexport!");
  // Implement actual export logic
  // e.g., convert to CSV, PDF, etc.
};
```

### E. Search & Filter Implementation

```typescript
// Filter data
const filteredData = data.filter(item => {
  const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     item.id.toString().includes(searchQuery);
  const matchFilter = filterType === "all" || item.type === filterType;
  return matchSearch && matchFilter;
});

// In JSX
<Input
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Cari..."
/>

<Select value={filterType} onValueChange={setFilterType}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">Semua</SelectItem>
    <SelectItem value="type1">Tipe 1</SelectItem>
  </SelectContent>
</Select>
```

### F. Form Binding Pattern

```typescript
<Input
  value={formData.fieldName}
  onChange={(e) => setFormData({...formData, fieldName: e.target.value})}
/>

<Select 
  value={formData.selectField} 
  onValueChange={(value) => setFormData({...formData, selectField: value})}
>
  {/* options */}
</Select>
```

### G. Button Actions Pattern

```typescript
// Add Button
<Button onClick={() => setShowAddModal(true)}>
  <Plus className="w-4 h-4 mr-2" />
  Tambah
</Button>

// Submit in Modal
<Button onClick={handleAdd}>
  <Plus className="w-4 h-4 mr-2" />
  Simpan
</Button>

// Edit Button
<Button onClick={() => handleEdit(item)}>
  <Edit className="w-4 h-4 mr-2" />
  Edit
</Button>

// Delete Button with Confirmation
<Button onClick={() => handleDeleteClick(item)}>
  <Trash2 className="w-4 h-4 mr-2" />
  Hapus
</Button>

// Export Button
<Button onClick={handleExport}>
  <Download className="w-4 h-4 mr-2" />
  Export
</Button>
```

### H. AlertDialog for Delete Confirmation

```typescript
<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
      <AlertDialogDescription>
        Apakah Anda yakin ingin menghapus <strong>{selectedItem?.name}</strong>? 
        Tindakan ini tidak dapat dibatalkan.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Batal</AlertDialogCancel>
      <AlertDialogAction 
        className="bg-red-600 hover:bg-red-700"
        onClick={handleDelete}
      >
        Hapus
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## 🎯 Quick Implementation Checklist

Untuk setiap halaman admin, pastikan:

1. ☑️ Import toast dan AlertDialog
2. ☑️ Ubah const data menjadi useState
3. ☑️ Tambahkan state untuk modals
4. ☑️ Tambahkan state untuk form
5. ☑️ Implementasi handleAdd function
6. ☑️ Implementasi handleUpdate function
7. ☑️ Implementasi handleDelete function
8. ☑️ Bind all form inputs
9. ☑️ Connect all buttons ke functions
10. ☑️ Add toast notifications
11. ☑️ Add delete confirmation dialog
12. ☑️ Test all CRUD operations

## 📋 Halaman yang Perlu Implementasi

### 2. Manajemen Bank Sampah
- [ ] Tambah/Edit harga sampah
- [ ] Hapus harga sampah
- [ ] Lihat detail setoran
- [ ] Filter & search

### 3. Manajemen Jadwal
- [ ] Tambah jadwal (sampah/keamanan/kegiatan)
- [ ] Edit jadwal
- [ ] Hapus jadwal
- [ ] Filter per tipe jadwal

### 4. Manajemen Informasi
- [ ] Buat pengumuman
- [ ] Edit pengumuman
- [ ] Hapus pengumuman
- [ ] Publikasi/Draft toggle
- [ ] Arsipkan pengumuman

### 5. Laporan Keuangan
- [ ] Filter periode (bulan/tahun)
- [ ] Export PDF
- [ ] Filter transaksi

### 6. Laporan Bank Sampah
- [ ] Filter periode
- [ ] Export PDF
- [ ] View detail per kategori

## 💡 Tips

1. **Validation**: Selalu validasi input sebelum submit
2. **Toast Messages**: Gunakan toast.success() dan toast.error()
3. **Confirmation**: Gunakan AlertDialog untuk aksi destruktif (delete)
4. **Reset**: Jangan lupa reset form setelah submit
5. **Loading States**: Tambahkan loading state untuk operasi async (jika perlu)

## 🔄 Next Steps

Untuk mengimplementasikan fungsi pada halaman lain:
1. Copy pattern dari manajemen-petugas-page.tsx
2. Sesuaikan dengan data structure halaman tersebut
3. Update interface/type definitions
4. Test semua fungsi CRUD
5. Verify toast notifications muncul dengan benar

---

**Note**: File `manajemen-petugas-page.tsx` sudah fully functional dan bisa digunakan sebagai reference untuk implementasi halaman lain.

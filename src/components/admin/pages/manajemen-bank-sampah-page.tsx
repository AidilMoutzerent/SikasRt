import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { toast } from "sonner@2.0.3";
import {
  HargaSampahList,
  HargaSampahForm,
  HargaSampahDeleteDialog,
  type HargaSampah,
} from "../crud/bank-sampah";

export function ManajemenBankSampahPage() {
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedHarga, setSelectedHarga] = useState<HargaSampah | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  // Form state
  const [formHarga, setFormHarga] = useState({
    jenis: "",
    kategori: "",
    harga: "",
    satuan: "kg"
  });

  // Data harga sampah
  const [hargaSampah, setHargaSampah] = useState<HargaSampah[]>([
    { id: 1, jenis: "Plastik", kategori: "PET", harga: 3000, satuan: "kg", status: "Aktif" },
    { id: 2, jenis: "Plastik", kategori: "HDPE", harga: 2500, satuan: "kg", status: "Aktif" },
    { id: 3, jenis: "Kertas", kategori: "HVS", harga: 1500, satuan: "kg", status: "Aktif" },
    { id: 4, jenis: "Kertas", kategori: "Koran", harga: 1000, satuan: "kg", status: "Aktif" },
    { id: 5, jenis: "Logam", kategori: "Aluminium", harga: 15000, satuan: "kg", status: "Aktif" },
    { id: 6, jenis: "Logam", kategori: "Besi", harga: 5000, satuan: "kg", status: "Aktif" },
    { id: 7, jenis: "Kaca", kategori: "Botol", harga: 500, satuan: "kg", status: "Aktif" },
  ]);

  // Handlers
  const handleCreate = () => {
    setFormMode("create");
    resetFormHarga();
    setShowFormModal(true);
  };

  const handleEdit = (harga: HargaSampah) => {
    setFormMode("edit");
    setSelectedHarga(harga);
    setFormHarga({
      jenis: harga.jenis,
      kategori: harga.kategori,
      harga: harga.harga.toString(),
      satuan: harga.satuan
    });
    setShowFormModal(true);
  };

  const handleSubmit = () => {
    if (!formHarga.jenis || !formHarga.kategori || !formHarga.harga) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    if (formMode === "create") {
      const newHarga: HargaSampah = {
        id: hargaSampah.length + 1,
        jenis: formHarga.jenis,
        kategori: formHarga.kategori,
        harga: parseInt(formHarga.harga),
        satuan: formHarga.satuan,
        status: "Aktif"
      };

      setHargaSampah([...hargaSampah, newHarga]);
      toast.success(`Harga ${formHarga.kategori} berhasil ditambahkan!`);
    } else {
      if (!selectedHarga) return;

      const updatedData = hargaSampah.map(h =>
        h.id === selectedHarga.id
          ? {
              ...h,
              jenis: formHarga.jenis,
              kategori: formHarga.kategori,
              harga: parseInt(formHarga.harga),
              satuan: formHarga.satuan
            }
          : h
      );

      setHargaSampah(updatedData);
      toast.success("Harga berhasil diperbarui!");
    }

    setShowFormModal(false);
    resetFormHarga();
  };

  const handleDeleteClick = (harga: HargaSampah) => {
    setSelectedHarga(harga);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (!selectedHarga) return;

    const updatedData = hargaSampah.filter(h => h.id !== selectedHarga.id);
    setHargaSampah(updatedData);
    toast.success(`Harga ${selectedHarga.kategori} berhasil dihapus!`);
    setShowDeleteDialog(false);
    setSelectedHarga(null);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormHarga({ ...formHarga, [field]: value });
  };

  const resetFormHarga = () => {
    setFormHarga({
      jenis: "",
      kategori: "",
      harga: "",
      satuan: "kg"
    });
    setSelectedHarga(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-gray-900 mb-1">Manajemen Bank Sampah</h1>
            <p className="text-gray-600">Kelola harga sampah</p>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={handleCreate}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Jenis Sampah
          </Button>
        </div>

        {/* Daftar Harga Sampah */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Harga Sampah</CardTitle>
          </CardHeader>
          <CardContent>
            <HargaSampahList
              data={hargaSampah}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </CardContent>
        </Card>
      </div>

      {/* Form Modal */}
      <HargaSampahForm
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          resetFormHarga();
        }}
        onSubmit={handleSubmit}
        formData={formHarga}
        onChange={handleFormChange}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <HargaSampahDeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        item={selectedHarga}
      />
    </>
  );
}
import { useState, useMemo } from "react";
import { Search, Plus, Trash2, Save, User, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
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

interface Warga {
  id: number;
  nama: string;
  nomorRumah: string;
  blok: string;
  saldo: number;
}

interface JenisSampah {
  id: string;
  nama: string;
  hargaPerKg: number;
}

interface ItemSampah {
  id: string;
  jenisSampahId: string;
  berat: number;
}

const daftarWarga: Warga[] = [
  { id: 1, nama: "Siti Aminah", nomorRumah: "B2", blok: "Blok B", saldo: 12000 },
  { id: 2, nama: "Budi Santoso", nomorRumah: "A5", blok: "Blok A", saldo: 25000 },
  { id: 3, nama: "Ahmad Zulfikar", nomorRumah: "C12", blok: "Blok C", saldo: 8500 },
  { id: 4, nama: "Dewi Lestari", nomorRumah: "B7", blok: "Blok B", saldo: 15000 },
  { id: 5, nama: "Eko Prasetyo", nomorRumah: "A3", blok: "Blok A", saldo: 32000 },
];

const jenisSampah: JenisSampah[] = [
  { id: "kardus", nama: "Kardus", hargaPerKg: 1500 },
  { id: "botol-plastik", nama: "Botol Plastik", hargaPerKg: 1000 },
  { id: "kertas", nama: "Kertas", hargaPerKg: 800 },
  { id: "besi", nama: "Besi/Logam", hargaPerKg: 3000 },
  { id: "aluminium", nama: "Kaleng Aluminium", hargaPerKg: 2500 },
  { id: "kaca", nama: "Kaca/Botol Kaca", hargaPerKg: 500 },
];

export function InputSetoranPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWarga, setSelectedWarga] = useState<Warga | null>(null);
  const [itemsSampah, setItemsSampah] = useState<ItemSampah[]>([
    { id: "1", jenisSampahId: "", berat: 0 }
  ]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Filter warga berdasarkan search query
  const filteredWarga = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return daftarWarga.filter(
      w => w.nama.toLowerCase().includes(query) || 
           w.nomorRumah.toLowerCase().includes(query) ||
           w.blok.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Calculate totals
  const totals = useMemo(() => {
    let totalBerat = 0;
    let totalNilai = 0;

    itemsSampah.forEach(item => {
      if (item.jenisSampahId && item.berat > 0) {
        const jenis = jenisSampah.find(j => j.id === item.jenisSampahId);
        if (jenis) {
          totalBerat += item.berat;
          totalNilai += item.berat * jenis.hargaPerKg;
        }
      }
    });

    return { totalBerat, totalNilai };
  }, [itemsSampah]);

  const handleSelectWarga = (warga: Warga) => {
    setSelectedWarga(warga);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleAddItem = () => {
    setItemsSampah([
      ...itemsSampah,
      { id: Date.now().toString(), jenisSampahId: "", berat: 0 }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (itemsSampah.length > 1) {
      setItemsSampah(itemsSampah.filter(item => item.id !== id));
    }
  };

  const handleUpdateItem = (id: string, field: keyof ItemSampah, value: string | number) => {
    setItemsSampah(itemsSampah.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const getSubtotal = (item: ItemSampah) => {
    if (!item.jenisSampahId || !item.berat) return 0;
    const jenis = jenisSampah.find(j => j.id === item.jenisSampahId);
    return jenis ? item.berat * jenis.hargaPerKg : 0;
  };

  const handleSaveTransaction = () => {
    if (!selectedWarga) {
      toast.error("Pilih warga terlebih dahulu!");
      return;
    }

    const validItems = itemsSampah.filter(item => item.jenisSampahId && item.berat > 0);
    if (validItems.length === 0) {
      toast.error("Tambahkan minimal 1 jenis sampah!");
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmSave = () => {
    // Simulate saving transaction
    toast.success(`Transaksi berhasil disimpan! Total: Rp ${totals.totalNilai.toLocaleString("id-ID")}`);
    
    // Reset form
    setSelectedWarga(null);
    setItemsSampah([{ id: "1", jenisSampahId: "", berat: 0 }]);
    setShowConfirmDialog(false);
  };

  const handleReset = () => {
    setSelectedWarga(null);
    setItemsSampah([{ id: "1", jenisSampahId: "", berat: 0 }]);
    setSearchQuery("");
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 lg:ml-72">
      <div className="space-y-6">
        {/* Page Title - Desktop Only */}
        <div className="hidden lg:block">
          <h1 className="text-gray-900 mb-1">Input Setoran Bank Sampah</h1>
          <p className="text-gray-600">Catat setoran sampah dari warga</p>
        </div>

        {/* Step 1: Cari Warga */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-sm">1</span>
              Cari Warga
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Cari berdasarkan Nama / Nomor Rumah..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
              />

              {/* Search Results Dropdown */}
              {showSearchResults && searchQuery && filteredWarga.length > 0 && (
                <Card className="absolute top-full mt-1 w-full z-10 max-h-64 overflow-y-auto">
                  <CardContent className="p-2">
                    {filteredWarga.map(warga => (
                      <button
                        key={warga.id}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => handleSelectWarga(warga)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${warga.nama}`} />
                            <AvatarFallback>{warga.nama.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-gray-900">{warga.nama}</p>
                            <p className="text-sm text-gray-600">{warga.blok} - {warga.nomorRumah}</p>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                            Rp {warga.saldo.toLocaleString("id-ID")}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Selected Warga */}
            {selectedWarga && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedWarga.nama}`} />
                    <AvatarFallback>{selectedWarga.nama.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-gray-600" />
                      <p className="text-gray-900">Warga: {selectedWarga.nama}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-gray-600" />
                      <p className="text-sm text-gray-600">
                        {selectedWarga.blok} {selectedWarga.nomorRumah} • Saldo: Rp {selectedWarga.saldo.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Ganti
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Input Sampah */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-sm">2</span>
              Detail Sampah
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {itemsSampah.map((item, index) => (
              <div key={item.id} className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Jenis Sampah */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-sm">Jenis Sampah</Label>
                      <Select
                        value={item.jenisSampahId}
                        onValueChange={(value) => handleUpdateItem(item.id, "jenisSampahId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis sampah" />
                        </SelectTrigger>
                        <SelectContent>
                          {jenisSampah.map(jenis => (
                            <SelectItem key={jenis.id} value={jenis.id}>
                              {jenis.nama} (Rp {jenis.hargaPerKg.toLocaleString("id-ID")}/kg)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Berat */}
                    <div className="space-y-1.5">
                      <Label className="text-sm">Berat (kg)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="0"
                        value={item.berat || ""}
                        onChange={(e) => handleUpdateItem(item.id, "berat", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="flex flex-col justify-end h-full pt-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={itemsSampah.length === 1}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Subtotal */}
                {item.jenisSampahId && item.berat > 0 && (
                  <div className="bg-gray-50 rounded px-3 py-2 text-sm">
                    <span className="text-gray-600">Subtotal: </span>
                    <span className="text-gray-900">Rp {getSubtotal(item).toLocaleString("id-ID")}</span>
                  </div>
                )}

                {index < itemsSampah.length - 1 && <hr className="border-gray-200" />}
              </div>
            ))}

            {/* Add Item Button */}
            <Button
              variant="outline"
              className="w-full border-dashed border-2"
              onClick={handleAddItem}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Jenis Sampah
            </Button>
          </CardContent>
        </Card>

        {/* Step 3: Konfirmasi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-sm">3</span>
              Konfirmasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 mb-1">Total Berat</p>
                <p className="text-blue-900">{totals.totalBerat.toFixed(1)} kg</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 mb-1">Total Setoran</p>
                <p className="text-green-900">Rp {totals.totalNilai.toLocaleString("id-ID")}</p>
              </div>
            </div>

            {/* New Balance */}
            {selectedWarga && totals.totalNilai > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Saldo Baru</p>
                    <p className="text-gray-900">
                      Rp {(selectedWarga.saldo + totals.totalNilai).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600">+ Rp {totals.totalNilai.toLocaleString("id-ID")}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                size="lg"
                onClick={handleReset}
                className="h-12"
              >
                Reset
              </Button>
              <Button
                size="lg"
                onClick={handleSaveTransaction}
                disabled={!selectedWarga || totals.totalNilai === 0}
                className="bg-green-600 hover:bg-green-700 h-12"
              >
                <Save className="w-5 h-5 mr-2" />
                Simpan Transaksi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Transaksi</AlertDialogTitle>
            <AlertDialogDescription>
              Pastikan data yang diinput sudah benar:
            </AlertDialogDescription>
            {selectedWarga && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm text-gray-900">
                <div>Warga: <strong>{selectedWarga.nama}</strong></div>
                <div>Total Berat: <strong>{totals.totalBerat.toFixed(1)} kg</strong></div>
                <div>Total Setoran: <strong>Rp {totals.totalNilai.toLocaleString("id-ID")}</strong></div>
                <div>Saldo Baru: <strong>Rp {(selectedWarga.saldo + totals.totalNilai).toLocaleString("id-ID")}</strong></div>
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSave}
              className="bg-green-600 hover:bg-green-700"
            >
              Ya, Simpan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

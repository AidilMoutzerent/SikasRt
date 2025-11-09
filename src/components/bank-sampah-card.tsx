import { Coins, Recycle, History, ArrowRight, Calendar, MapPin, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function BankSampahCard() {
  const [saldo, setSaldo] = useState(15000);
  const [showSetorModal, setShowSetorModal] = useState(false);
  const [showTarikModal, setShowTarikModal] = useState(false);
  const [showRiwayatModal, setShowRiwayatModal] = useState(false);
  const [setorStep, setSetorStep] = useState<"form" | "success">("form");
  
  const handleSetorSampah = () => {
    setShowSetorModal(true);
    setSetorStep("form");
  };

  const handleConfirmSetor = () => {
    setSetorStep("success");
    setTimeout(() => {
      setSaldo(saldo + 15000);
      setShowSetorModal(false);
      setSetorStep("form");
    }, 2000);
  };

  const handleBayarIuran = () => {
    if (saldo >= 15000) {
      setSaldo(saldo - 15000);
      alert("Saldo berhasil digunakan untuk bayar iuran!");
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Recycle className="w-5 h-5 text-green-600" />
            </div>
            <CardTitle>Saldo Bank Sampah Anda</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <p className="text-sm opacity-90 mb-1">Total Saldo</p>
            <p className="text-3xl mb-1">Rp {saldo.toLocaleString("id-ID")}</p>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <Coins className="w-4 h-4" />
              <span>Dari 8 kali setoran</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2"
              onClick={handleSetorSampah}
            >
              <Recycle className="w-4 h-4" />
              Setor Sampah
            </Button>
            
            <Button 
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
              onClick={handleBayarIuran}
            >
              <ArrowRight className="w-4 h-4" />
              Bayar Iuran
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2"
              onClick={() => setShowRiwayatModal(true)}
            >
              <History className="w-4 h-4" />
              Lihat Riwayat
            </Button>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              💡 <span className="font-medium">Tips:</span> Saldo Anda sudah cukup untuk membayar 60% dari iuran bulan ini!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Setor Sampah Modal */}
      <Dialog open={showSetorModal} onOpenChange={setShowSetorModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {setorStep === "form" ? "Setor Sampah" : "Penjemputan Dijadwalkan!"}
            </DialogTitle>
          </DialogHeader>

          {setorStep === "form" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Jenis Sampah</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis sampah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plastik">Plastik (PET) - Rp 3.000/kg</SelectItem>
                    <SelectItem value="kertas">Kertas/Kardus - Rp 2.500/kg</SelectItem>
                    <SelectItem value="kaca">Botol Kaca - Rp 4.000/kg</SelectItem>
                    <SelectItem value="logam">Kaleng/Logam - Rp 5.000/kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Perkiraan Berat (kg)</Label>
                <Input type="number" placeholder="Contoh: 5" defaultValue="5" />
              </div>

              <div className="space-y-2">
                <Label>Tanggal Penjemputan</Label>
                <Input type="date" />
              </div>

              <div className="space-y-2">
                <Label>Waktu Penjemputan</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih waktu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pagi">Pagi (08:00 - 10:00)</SelectItem>
                    <SelectItem value="siang">Siang (10:00 - 12:00)</SelectItem>
                    <SelectItem value="sore">Sore (14:00 - 16:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-900">Perkiraan Nilai</span>
                </div>
                <p className="text-2xl text-green-600">Rp 15.000</p>
                <p className="text-xs text-green-700 mt-1">5 kg × Rp 3.000/kg</p>
              </div>

              <div className="space-y-2">
                <Label>Alamat Penjemputan</Label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-900">Jl. Melati No. 15, RT 05/RW 02</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Catatan (Opsional)</Label>
                <Input placeholder="Contoh: Sampah sudah dipilah" />
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleConfirmSetor}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Jadwalkan Penjemputan
              </Button>
            </div>
          )}

          {setorStep === "success" && (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Penjemputan Dijadwalkan!</h3>
              <p className="text-gray-600 mb-4">
                Petugas akan datang sesuai jadwal yang Anda pilih
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Jenis:</span>
                  <span className="text-gray-900">Plastik (PET)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Berat:</span>
                  <span className="text-gray-900">5 kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Perkiraan Nilai:</span>
                  <span className="text-green-600">Rp 15.000</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Riwayat Modal */}
      <Dialog open={showRiwayatModal} onOpenChange={setShowRiwayatModal}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Riwayat Transaksi</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-900">Setoran Plastik</p>
                    <p className="text-sm text-gray-600">5 Nov 2025</p>
                  </div>
                </div>
                <p className="text-green-600">+Rp 15.000</p>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900">Bayar Iuran RT</p>
                    <p className="text-sm text-gray-600">1 Nov 2025</p>
                  </div>
                </div>
                <p className="text-red-600">-Rp 25.000</p>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-900">Setoran Kertas</p>
                    <p className="text-sm text-gray-600">29 Okt 2025</p>
                  </div>
                </div>
                <p className="text-green-600">+Rp 20.000</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

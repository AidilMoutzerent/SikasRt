import { useState } from "react";
import { Calendar, User, Package, DollarSign, Clock, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { toast } from "sonner@2.0.3";

interface Transaksi {
  id: number;
  waktu: string;
  wargaNama: string;
  wargaRumah: string;
  itemSampah: {
    jenis: string;
    berat: number;
    harga: number;
  }[];
  totalBerat: number;
  totalNilai: number;
}

export function RiwayatTransaksiPage() {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const [transaksiData] = useState<Transaksi[]>([
    {
      id: 1,
      waktu: "09:15",
      wargaNama: "Siti Aminah",
      wargaRumah: "B2",
      itemSampah: [
        { jenis: "Kardus", berat: 2, harga: 3000 },
        { jenis: "Botol Plastik", berat: 0.5, harga: 500 },
      ],
      totalBerat: 2.5,
      totalNilai: 3500,
    },
    {
      id: 2,
      waktu: "09:32",
      wargaNama: "Budi Santoso",
      wargaRumah: "A5",
      itemSampah: [
        { jenis: "Kertas", berat: 1.5, harga: 1200 },
        { jenis: "Kardus", berat: 3, harga: 4500 },
        { jenis: "Kaleng Aluminium", berat: 0.8, harga: 2000 },
      ],
      totalBerat: 5.3,
      totalNilai: 7700,
    },
    {
      id: 3,
      waktu: "10:05",
      wargaNama: "Dewi Lestari",
      wargaRumah: "B7",
      itemSampah: [
        { jenis: "Botol Plastik", berat: 1.2, harga: 1200 },
        { jenis: "Kaca/Botol Kaca", berat: 2, harga: 1000 },
      ],
      totalBerat: 3.2,
      totalNilai: 2200,
    },
    {
      id: 4,
      waktu: "10:28",
      wargaNama: "Ahmad Zulfikar",
      wargaRumah: "C12",
      itemSampah: [
        { jenis: "Besi/Logam", berat: 1.5, harga: 4500 },
      ],
      totalBerat: 1.5,
      totalNilai: 4500,
    },
    {
      id: 5,
      waktu: "11:10",
      wargaNama: "Eko Prasetyo",
      wargaRumah: "A3",
      itemSampah: [
        { jenis: "Kardus", berat: 4, harga: 6000 },
        { jenis: "Kertas", berat: 2, harga: 1600 },
        { jenis: "Botol Plastik", berat: 1.5, harga: 1500 },
      ],
      totalBerat: 7.5,
      totalNilai: 9100,
    },
  ]);

  const stats = {
    totalTransaksi: transaksiData.length,
    totalBerat: transaksiData.reduce((sum, t) => sum + t.totalBerat, 0),
    totalNilai: transaksiData.reduce((sum, t) => sum + t.totalNilai, 0),
  };

  const handleExport = () => {
    toast.success("Data transaksi hari ini berhasil diexport!");
    // Implement actual export logic here
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6 lg:ml-72">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-gray-900 mb-1">Riwayat Transaksi</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <p>{today}</p>
            </div>
          </div>
          <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Transaksi</p>
                  <p className="text-gray-900">{stats.totalTransaksi} transaksi</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Berat</p>
                  <p className="text-gray-900">{stats.totalBerat.toFixed(1)} kg</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Nilai</p>
                  <p className="text-gray-900">Rp {stats.totalNilai.toLocaleString("id-ID")}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {transaksiData.map((transaksi) => (
            <Card key={transaksi.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Time Badge */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center bg-green-50 rounded-lg p-2 min-w-[60px]">
                    <Clock className="w-4 h-4 text-green-600 mb-1" />
                    <span className="text-green-900">{transaksi.waktu}</span>
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-1 space-y-3">
                    {/* Warga Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${transaksi.wargaNama}`} />
                        <AvatarFallback>{transaksi.wargaNama.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-gray-900">{transaksi.wargaNama}</p>
                        <p className="text-sm text-gray-600">Rumah {transaksi.wargaRumah}</p>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                      {transaksi.itemSampah.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">
                            {item.jenis} ({item.berat} kg)
                          </span>
                          <span className="text-gray-900">
                            Rp {item.harga.toLocaleString("id-ID")}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                          <Package className="w-3 h-3 mr-1" />
                          {transaksi.totalBerat.toFixed(1)} kg
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          <DollarSign className="w-3 h-3 mr-1" />
                          Rp {transaksi.totalNilai.toLocaleString("id-ID")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {transaksiData.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-gray-900 mb-2">Belum Ada Transaksi</h3>
              <p className="text-gray-600">Transaksi hari ini belum ada. Mulai input setoran sampah dari warga.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

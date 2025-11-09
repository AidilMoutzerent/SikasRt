import { Coins, TrendingUp, Recycle, ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function BankSampahPage() {
  const saldo = 15000;
  const totalSetoran = 125000;
  const totalPenarikan = 110000;

  const riwayatSetoran = [
    { id: 1, tanggal: "5 Nov 2025", jenis: "Plastik", berat: "5 kg", nilai: 15000, status: "selesai" },
    { id: 2, tanggal: "29 Okt 2025", jenis: "Kertas", berat: "8 kg", nilai: 20000, status: "selesai" },
    { id: 3, tanggal: "22 Okt 2025", jenis: "Botol Kaca", berat: "3 kg", nilai: 12000, status: "selesai" },
    { id: 4, tanggal: "15 Okt 2025", jenis: "Kardus", berat: "10 kg", nilai: 25000, status: "selesai" },
  ];

  const riwayatPenarikan = [
    { id: 1, tanggal: "1 Nov 2025", keperluan: "Bayar Iuran RT", nilai: 25000, status: "selesai" },
    { id: 2, tanggal: "1 Okt 2025", keperluan: "Bayar Iuran RT", nilai: 25000, status: "selesai" },
    { id: 3, tanggal: "20 Sep 2025", keperluan: "Transfer ke Rekening", nilai: 50000, status: "selesai" },
  ];

  const hargaSampah = [
    { jenis: "Plastik (PET)", harga: "Rp 3.000/kg", icon: "♻️" },
    { jenis: "Kertas/Kardus", harga: "Rp 2.500/kg", icon: "📦" },
    { jenis: "Botol Kaca", harga: "Rp 4.000/kg", icon: "🍾" },
    { jenis: "Kaleng/Logam", harga: "Rp 5.000/kg", icon: "🥫" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Bank Sampah Saya</h1>
        <p className="text-gray-600">Kelola sampah dan dapatkan penghasilan tambahan</p>
      </div>

      {/* Saldo Card */}
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <p className="text-sm opacity-90 mb-2">Total Saldo Anda</p>
              <p className="text-4xl mb-4">Rp {saldo.toLocaleString("id-ID")}</p>
              <div className="flex items-center gap-4 text-sm opacity-90">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  <span>8 kali setoran</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>+20% bulan ini</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="bg-white text-green-600 hover:bg-gray-100">
                <Recycle className="w-4 h-4 mr-2" />
                Setor Sampah
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/20">
                <ArrowDownRight className="w-4 h-4 mr-2" />
                Tarik Saldo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Setoran</p>
                <p className="text-2xl text-gray-900">Rp {totalSetoran.toLocaleString("id-ID")}</p>
                <p className="text-sm text-green-600 mt-1">↑ 15% dari bulan lalu</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Penarikan</p>
                <p className="text-2xl text-gray-900">Rp {totalPenarikan.toLocaleString("id-ID")}</p>
                <p className="text-sm text-gray-600 mt-1">3 transaksi</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Harga Sampah */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Harga Sampah</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {hargaSampah.map((item, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-gray-900 mb-1">{item.jenis}</p>
                <p className="text-sm text-green-600">{item.harga}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Riwayat Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="setoran">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="setoran">Setoran</TabsTrigger>
              <TabsTrigger value="penarikan">Penarikan</TabsTrigger>
            </TabsList>

            <TabsContent value="setoran" className="space-y-3">
              {riwayatSetoran.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 mb-1">{item.jenis}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{item.tanggal}</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>{item.berat}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600">+Rp {item.nilai.toLocaleString("id-ID")}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="penarikan" className="space-y-3">
              {riwayatPenarikan.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <ArrowDownRight className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 mb-1">{item.keperluan}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{item.tanggal}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600">-Rp {item.nilai.toLocaleString("id-ID")}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

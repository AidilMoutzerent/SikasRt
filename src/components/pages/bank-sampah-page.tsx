import { Coins, TrendingUp, Recycle, ArrowUpRight, ArrowDownRight, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function BankSampahPage() {
  // Data akan diambil dari API - saat ini kosong
  const saldo = 0;
  const totalSetoran = 0;
  const totalPenarikan = 0;

  const riwayatSetoran: any[] = [];
  const riwayatPenarikan: any[] = [];
  const hargaSampah: any[] = [];

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
                  <span>{riwayatSetoran.length} kali setoran</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="bg-white text-green-600 hover:bg-gray-100" disabled>
                <Recycle className="w-4 h-4 mr-2" />
                Setor Sampah
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/20" disabled>
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
                <p className="text-sm text-gray-600 mt-1">Belum ada setoran</p>
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
                <p className="text-sm text-gray-600 mt-1">0 transaksi</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="setoran" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="setoran">Setoran</TabsTrigger>
              <TabsTrigger value="penarikan">Penarikan</TabsTrigger>
              <TabsTrigger value="harga">Harga Sampah</TabsTrigger>
            </TabsList>
            
            <TabsContent value="setoran" className="space-y-4">
              {riwayatSetoran.length > 0 ? (
                <div className="space-y-3">
                  {riwayatSetoran.map((item) => (
                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-900">{item.jenis}</p>
                      <p className="text-xs text-gray-500">{item.tanggal}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-gray-900 mb-2">Belum Ada Riwayat Setoran</h3>
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    Setoran sampah diinput oleh petugas bank sampah. Hubungi petugas untuk jadwal penjemputan sampah Anda.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="penarikan" className="space-y-4">
              {riwayatPenarikan.length > 0 ? (
                <div className="space-y-3">
                  {riwayatPenarikan.map((item) => (
                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-900">{item.keperluan}</p>
                      <p className="text-xs text-gray-500">{item.tanggal}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-gray-900 mb-2">Belum Ada Riwayat Penarikan</h3>
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    Riwayat penarikan saldo Anda akan muncul di sini.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="harga" className="space-y-4">
              {hargaSampah.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hargaSampah.map((item, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg flex items-center gap-4">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <p className="text-sm text-gray-900">{item.jenis}</p>
                        <p className="text-xs text-gray-600">{item.harga}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-gray-900 mb-2">Belum Ada Daftar Harga</h3>
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    Daftar harga sampah akan diisi oleh admin. Silakan hubungi admin atau petugas bank sampah untuk informasi harga.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

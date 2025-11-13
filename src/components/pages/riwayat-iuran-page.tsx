import { CheckCircle2, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function RiwayatIuranPage() {
  // Data akan diambil dari API - saat ini kosong
  const riwayatData: any[] = [];

  const totalBayar = 0;
  const totalLunas = 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1">Riwayat Iuran</h1>
          <p className="text-gray-600">Lihat histori pembayaran iuran RT Anda</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
                <p className="text-2xl text-gray-900">Rp {totalBayar.toLocaleString("id-ID")}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Bulan Lunas</p>
                <p className="text-2xl text-gray-900">{totalLunas} Bulan</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status Tahun Ini</p>
                <p className="text-2xl text-gray-900">0%</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Riwayat List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Riwayat</CardTitle>
        </CardHeader>
        <CardContent>
          {riwayatData.length > 0 ? (
            <div className="space-y-3">
              {riwayatData.map((item) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-900">{item.bulan}</p>
                  <p className="text-xs text-gray-500">{item.tanggal}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-gray-900 mb-2">Belum Ada Riwayat Iuran</h3>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                Riwayat pembayaran iuran Anda akan muncul di sini setelah Anda melakukan pembayaran.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { CheckCircle2, XCircle, Download, Filter, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

export function RiwayatIuranPage() {
  const riwayatData = [
    { id: 1, bulan: "November 2025", nominal: 25000, status: "lunas", tanggal: "1 Nov 2025", metode: "Transfer Bank" },
    { id: 2, bulan: "Oktober 2025", nominal: 25000, status: "lunas", tanggal: "1 Okt 2025", metode: "QRIS" },
    { id: 3, bulan: "September 2025", nominal: 25000, status: "lunas", tanggal: "3 Sep 2025", metode: "Bank Sampah" },
    { id: 4, bulan: "Agustus 2025", nominal: 25000, status: "lunas", tanggal: "2 Ags 2025", metode: "Cash" },
    { id: 5, bulan: "Juli 2025", nominal: 25000, status: "lunas", tanggal: "1 Jul 2025", metode: "Transfer Bank" },
    { id: 6, bulan: "Juni 2025", nominal: 25000, status: "terlambat", tanggal: "15 Jun 2025", metode: "Cash", denda: 5000 },
  ];

  const totalBayar = riwayatData.reduce((acc, item) => acc + item.nominal + (item.denda || 0), 0);
  const totalLunas = riwayatData.filter(item => item.status === "lunas").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1">Riwayat Iuran</h1>
          <p className="text-gray-600">Lihat histori pembayaran iuran RT Anda</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Unduh Laporan
        </Button>
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
                <p className="text-2xl text-gray-900">100%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Riwayat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Cari berdasarkan bulan..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Riwayat List */}
          <div className="space-y-3">
            {riwayatData.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start gap-4 mb-3 md:mb-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.status === "lunas" ? "bg-green-100" : "bg-orange-100"
                  }`}>
                    {item.status === "lunas" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900 mb-1">{item.bulan}</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                      <span>{item.tanggal}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>{item.metode}</span>
                    </div>
                    {item.denda && (
                      <p className="text-sm text-orange-600 mt-1">
                        Termasuk denda keterlambatan: Rp {item.denda.toLocaleString("id-ID")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-gray-900">
                      Rp {(item.nominal + (item.denda || 0)).toLocaleString("id-ID")}
                    </p>
                    <Badge className={
                      item.status === "lunas" 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "bg-orange-600 hover:bg-orange-700"
                    }>
                      {item.status === "lunas" ? "LUNAS" : "TERLAMBAT"}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

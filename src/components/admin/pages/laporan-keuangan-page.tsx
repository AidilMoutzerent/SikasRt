import { useState } from "react";
import { Download, TrendingUp, TrendingDown, DollarSign, Wallet, Calendar, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function LaporanKeuanganPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState("semua");

  // Data untuk grafik pemasukan
  const pemasukanData = [
    { bulan: "Jan", iuran: 3750000, denda: 50000, lainnya: 100000 },
    { bulan: "Feb", iuran: 3700000, denda: 75000, lainnya: 150000 },
    { bulan: "Mar", iuran: 3750000, denda: 25000, lainnya: 200000 },
    { bulan: "Apr", iuran: 3700000, denda: 100000, lainnya: 50000 },
    { bulan: "Mei", iuran: 3750000, denda: 50000, lainnya: 180000 },
    { bulan: "Jun", iuran: 3750000, denda: 0, lainnya: 120000 },
  ];

  // Data untuk grafik pengeluaran
  const pengeluaranData = [
    { bulan: "Jan", operasional: 1200000, keamanan: 800000, kebersihan: 600000, lainnya: 300000 },
    { bulan: "Feb", operasional: 1150000, keamanan: 800000, kebersihan: 600000, lainnya: 250000 },
    { bulan: "Mar", operasional: 1300000, keamanan: 800000, kebersihan: 600000, lainnya: 400000 },
    { bulan: "Apr", operasional: 1100000, keamanan: 800000, kebersihan: 600000, lainnya: 200000 },
    { bulan: "Mei", operasional: 1250000, keamanan: 800000, kebersihan: 600000, lainnya: 350000 },
    { bulan: "Jun", operasional: 1200000, keamanan: 800000, kebersihan: 600000, lainnya: 300000 },
  ];

  // Data untuk pie chart
  const kategoriPengeluaran = [
    { name: "Operasional", value: 7200000, color: "#3b82f6" },
    { name: "Keamanan", value: 4800000, color: "#10b981" },
    { name: "Kebersihan", value: 3600000, color: "#f59e0b" },
    { name: "Lainnya", value: 1800000, color: "#8b5cf6" },
  ];

  // Data transaksi detail
  const transaksiData = [
    {
      id: 1,
      tanggal: "2024-11-08",
      kategori: "Pemasukan",
      jenis: "Iuran",
      keterangan: "Iuran bulanan November 2024",
      nominal: 3500000,
      saldo: 15200000
    },
    {
      id: 2,
      tanggal: "2024-11-07",
      kategori: "Pengeluaran",
      jenis: "Operasional",
      keterangan: "Pembelian alat kebersihan",
      nominal: -350000,
      saldo: 11700000
    },
    {
      id: 3,
      tanggal: "2024-11-05",
      kategori: "Pengeluaran",
      jenis: "Keamanan",
      keterangan: "Gaji petugas keamanan bulan Oktober",
      nominal: -1600000,
      saldo: 12050000
    },
    {
      id: 4,
      tanggal: "2024-11-03",
      kategori: "Pemasukan",
      jenis: "Denda",
      keterangan: "Denda keterlambatan pembayaran",
      nominal: 50000,
      saldo: 13650000
    },
    {
      id: 5,
      tanggal: "2024-11-01",
      kategori: "Pengeluaran",
      jenis: "Kebersihan",
      keterangan: "Gaji petugas kebersihan bulan Oktober",
      nominal: -1200000,
      saldo: 13600000
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1">Laporan Keuangan</h1>
          <p className="text-gray-600">Laporan pemasukan dan pengeluaran RT 05 / RW 02</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Bulan</SelectItem>
              <SelectItem value="01">Januari</SelectItem>
              <SelectItem value="02">Februari</SelectItem>
              <SelectItem value="03">Maret</SelectItem>
              <SelectItem value="04">April</SelectItem>
              <SelectItem value="05">Mei</SelectItem>
              <SelectItem value="06">Juni</SelectItem>
              <SelectItem value="07">Juli</SelectItem>
              <SelectItem value="08">Agustus</SelectItem>
              <SelectItem value="09">September</SelectItem>
              <SelectItem value="10">Oktober</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">Desember</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pemasukan</p>
                <h3 className="text-gray-900">Rp 24,1 Jt</h3>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+5% dari tahun lalu</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pengeluaran</p>
                <h3 className="text-gray-900">Rp 17,4 Jt</h3>
                <div className="flex items-center gap-1 text-sm text-orange-600 mt-1">
                  <TrendingDown className="w-4 h-4" />
                  <span>-2% dari tahun lalu</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saldo Akhir</p>
                <h3 className="text-gray-900">Rp 15,2 Jt</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <span>Per November 2024</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selisih</p>
                <h3 className="text-gray-900">Rp 6,7 Jt</h3>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Surplus</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Grafik Pemasukan & Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pemasukanData.map((item, index) => ({
                  ...item,
                  totalPengeluaran: pengeluaranData[index].operasional + 
                                   pengeluaranData[index].keamanan + 
                                   pengeluaranData[index].kebersihan + 
                                   pengeluaranData[index].lainnya,
                  totalPemasukan: item.iuran + item.denda + item.lainnya
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="totalPemasukan" stroke="#10b981" strokeWidth={2} name="Pemasukan" />
                  <Line type="monotone" dataKey="totalPengeluaran" stroke="#f59e0b" strokeWidth={2} name="Pengeluaran" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kategori Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={kategoriPengeluaran}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {kategoriPengeluaran.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rincian Pemasukan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pemasukanData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="iuran" fill="#10b981" name="Iuran" />
                  <Bar dataKey="denda" fill="#f59e0b" name="Denda" />
                  <Bar dataKey="lainnya" fill="#3b82f6" name="Lainnya" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rincian Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pengeluaranData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="operasional" fill="#3b82f6" name="Operasional" />
                  <Bar dataKey="keamanan" fill="#10b981" name="Keamanan" />
                  <Bar dataKey="kebersihan" fill="#f59e0b" name="Kebersihan" />
                  <Bar dataKey="lainnya" fill="#8b5cf6" name="Lainnya" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Riwayat Transaksi</CardTitle>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead className="text-right">Nominal</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaksiData.map((transaksi) => (
                  <TableRow key={transaksi.id}>
                    <TableCell className="text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {transaksi.tanggal}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={
                          transaksi.kategori === "Pemasukan"
                            ? "bg-green-50 text-green-700 border-green-300"
                            : "bg-orange-50 text-orange-700 border-orange-300"
                        }
                      >
                        {transaksi.kategori}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900">{transaksi.jenis}</TableCell>
                    <TableCell className="text-gray-600">{transaksi.keterangan}</TableCell>
                    <TableCell className={`text-right ${transaksi.nominal > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                      {transaksi.nominal > 0 ? '+' : ''}Rp {Math.abs(transaksi.nominal).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-gray-900">
                      Rp {transaksi.saldo.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Pemasukan (6 Bulan)</p>
              <h3 className="text-green-700">Rp 24.100.000</h3>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Pengeluaran (6 Bulan)</p>
              <h3 className="text-orange-700">Rp 17.400.000</h3>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Surplus</p>
              <h3 className="text-blue-700">Rp 6.700.000</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { Download, TrendingUp, Weight, Users, Recycle, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function LaporanBankSampahPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState("semua");

  // Data untuk grafik bulanan
  const monthlyData = [
    { bulan: "Jan", total: 1200000, berat: 450, transaksi: 135 },
    { bulan: "Feb", total: 1350000, berat: 520, transaksi: 148 },
    { bulan: "Mar", total: 1180000, berat: 480, transaksi: 142 },
    { bulan: "Apr", total: 1450000, berat: 580, transaksi: 165 },
    { bulan: "Mei", total: 1520000, berat: 610, transaksi: 172 },
    { bulan: "Jun", total: 1380000, berat: 550, transaksi: 158 },
  ];

  // Data untuk jenis sampah
  const jenisSampahData = [
    { name: "Plastik", berat: 1250, nilai: 3500000, color: "#3b82f6", persentase: 42 },
    { name: "Kertas", berat: 890, nilai: 1250000, color: "#10b981", persentase: 30 },
    { name: "Logam", berat: 450, nilai: 2800000, color: "#f59e0b", persentase: 15 },
    { name: "Kaca", berat: 380, nilai: 350000, color: "#8b5cf6", persentase: 13 },
  ];

  // Top contributors
  const topContributors = [
    { 
      rank: 1, 
      nama: "Dewi Lestari", 
      avatar: "Dewi",
      totalBerat: 45.5, 
      totalNilai: 135000, 
      transaksi: 12 
    },
    { 
      rank: 2, 
      nama: "Budi Santoso", 
      avatar: "Budi",
      totalBerat: 38.2, 
      totalNilai: 115000, 
      transaksi: 10 
    },
    { 
      rank: 3, 
      nama: "Siti Nurhaliza", 
      avatar: "Siti",
      totalBerat: 35.8, 
      totalNilai: 108000, 
      transaksi: 9 
    },
    { 
      rank: 4, 
      nama: "Andi Wijaya", 
      avatar: "Andi",
      totalBerat: 32.4, 
      totalNilai: 95000, 
      transaksi: 8 
    },
    { 
      rank: 5, 
      nama: "Rudi Hermawan", 
      avatar: "Rudi",
      totalBerat: 28.9, 
      totalNilai: 87000, 
      transaksi: 7 
    },
  ];

  // Statistik per kategori
  const kategoriStats = [
    {
      kategori: "Plastik",
      subKategori: [
        { nama: "PET", berat: 580, nilai: 1740000 },
        { nama: "HDPE", berat: 420, nilai: 1050000 },
        { nama: "PP", berat: 250, nilai: 710000 },
      ]
    },
    {
      kategori: "Kertas",
      subKategori: [
        { nama: "HVS", berat: 450, nilai: 675000 },
        { nama: "Koran", berat: 340, nilai: 340000 },
        { nama: "Kardus", berat: 100, nilai: 235000 },
      ]
    },
    {
      kategori: "Logam",
      subKategori: [
        { nama: "Aluminium", berat: 180, nilai: 2700000 },
        { nama: "Besi", berat: 220, nilai: 80000 },
        { nama: "Tembaga", berat: 50, nilai: 20000 },
      ]
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1">Laporan Bank Sampah</h1>
          <p className="text-gray-600">Laporan aktivitas dan statistik bank sampah RT 05 / RW 02</p>
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
                <p className="text-sm text-gray-600">Total Nilai Setoran</p>
                <h3 className="text-gray-900">Rp 8,1 Jt</h3>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12% dari tahun lalu</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Berat</p>
                <h3 className="text-gray-900">2.970 Kg</h3>
                <div className="flex items-center gap-1 text-sm text-blue-600 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>920 transaksi</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Weight className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warga Aktif</p>
                <h3 className="text-gray-900">87 Warga</h3>
                <div className="flex items-center gap-1 text-sm text-purple-600 mt-1">
                  <span>58% dari total warga</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dampak Lingkungan</p>
                <h3 className="text-gray-900">2,97 Ton</h3>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <Recycle className="w-4 h-4" />
                  <span>Sampah terdaur ulang</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Recycle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tren Setoran Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} name="Total Nilai (Rp)" />
                  <Line yAxisId="right" type="monotone" dataKey="berat" stroke="#3b82f6" strokeWidth={2} name="Berat (Kg)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Komposisi Jenis Sampah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jenisSampahData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, persentase }) => `${name} ${persentase}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="berat"
                  >
                    {jenisSampahData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {jenisSampahData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-gray-900">{item.berat} kg</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Nilai Setoran per Jenis Sampah</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jenisSampahData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="nilai" fill="#10b981" name="Total Nilai (Rp)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Contributors */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Kontributor (6 Bulan Terakhir)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Nama Warga</TableHead>
                  <TableHead className="text-right">Total Berat</TableHead>
                  <TableHead className="text-right">Total Nilai</TableHead>
                  <TableHead className="text-right">Transaksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topContributors.map((contributor) => (
                  <TableRow key={contributor.rank}>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Badge 
                          className={
                            contributor.rank === 1 
                              ? "bg-yellow-100 text-yellow-700 border-yellow-300" 
                              : contributor.rank === 2
                              ? "bg-gray-100 text-gray-700 border-gray-300"
                              : contributor.rank === 3
                              ? "bg-orange-100 text-orange-700 border-orange-300"
                              : "bg-blue-100 text-blue-700 border-blue-300"
                          }
                          variant="outline"
                        >
                          #{contributor.rank}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contributor.avatar}`} />
                          <AvatarFallback>{contributor.nama.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="text-gray-900">{contributor.nama}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-gray-900">{contributor.totalBerat} kg</TableCell>
                    <TableCell className="text-right text-green-600">Rp {contributor.totalNilai.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-gray-600">{contributor.transaksi}x</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Category Details */}
      <Card>
        <CardHeader>
          <CardTitle>Rincian per Kategori Sampah</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {kategoriStats.map((kategori, index) => (
              <div key={index} className="space-y-3">
                <h4 className="text-gray-900">{kategori.kategori}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {kategori.subKategori.map((sub, subIndex) => (
                    <div key={subIndex} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                          {sub.nama}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Berat</span>
                          <span className="text-gray-900">{sub.berat} kg</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Nilai</span>
                          <span className="text-green-600">Rp {sub.nilai.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Nilai (6 Bulan)</p>
              <h3 className="text-green-700">Rp 8.080.000</h3>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Berat (6 Bulan)</p>
              <h3 className="text-blue-700">2.970 Kg</h3>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Rata-rata/Bulan</p>
              <h3 className="text-purple-700">Rp 1.346.667</h3>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Partisipasi Warga</p>
              <h3 className="text-orange-700">58%</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

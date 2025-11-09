import { Megaphone, Pin, Phone, Users, MapPin, FileText, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function InformasiRTPage() {
  const pengumuman = [
    {
      id: 1,
      judul: "Kerja Bakti Minggu Ini",
      tanggal: "5 Nov 2025",
      kategori: "kegiatan",
      prioritas: "tinggi",
      isi: "Kerja bakti akan diadakan pada hari Minggu, 10 November 2025 pukul 06:00 - 08:00 WIB. Mohon kehadiran seluruh warga.",
      pinned: true
    },
    {
      id: 2,
      judul: "Perbaikan Jalan Mulai Senin",
      tanggal: "3 Nov 2025",
      kategori: "pengumuman",
      prioritas: "tinggi",
      isi: "Perbaikan jalan di area RT akan dimulai pada Senin, 11 November 2025. Harap berhati-hati saat melewati area konstruksi.",
      pinned: true
    },
    {
      id: 3,
      judul: "Pembayaran Iuran November Dibuka",
      tanggal: "1 Nov 2025",
      kategori: "iuran",
      prioritas: "sedang",
      isi: "Pembayaran iuran bulan November sudah dibuka. Batas pembayaran tanggal 10 November 2025.",
      pinned: false
    },
    {
      id: 4,
      judul: "Lomba 17 Agustus - Pemenang",
      tanggal: "18 Ags 2025",
      kategori: "pengumuman",
      prioritas: "rendah",
      isi: "Selamat kepada para pemenang lomba 17 Agustus. Hadiah dapat diambil di rumah ketua RT.",
      pinned: false
    },
  ];

  const kontak = [
    { jabatan: "Ketua RT", nama: "Pak Bambang", telepon: "0812-3456-7890" },
    { jabatan: "Sekretaris", nama: "Ibu Siti", telepon: "0813-4567-8901" },
    { jabatan: "Bendahara", nama: "Pak Ahmad", telepon: "0814-5678-9012" },
    { jabatan: "Seksi Keamanan", nama: "Pak Joko", telepon: "0815-6789-0123" },
  ];

  const peraturan = [
    { id: 1, judul: "Peraturan Jam Istirahat", isi: "Diharapkan tidak membuat kebisingan pada pukul 12:00-14:00 dan 21:00-06:00" },
    { id: 2, judul: "Parkir Kendaraan", isi: "Kendaraan diparkir di area yang telah ditentukan, tidak menghalangi jalan umum" },
    { id: 3, judul: "Pembuangan Sampah", isi: "Sampah harus dipisahkan (organik dan anorganik) sebelum dibuang" },
    { id: 4, judul: "Kegiatan Warga", isi: "Kegiatan yang melibatkan banyak orang harus memberitahu ketua RT minimal 3 hari sebelumnya" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Informasi RT</h1>
        <p className="text-gray-600">Pengumuman, kontak, dan informasi penting RT 05 / RW 02</p>
      </div>

      {/* RT Info Card */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-white mb-1">RT 05 / RW 02</h2>
              <p className="text-sm opacity-90">Kelurahan Mekar Sari</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-sm opacity-90 mb-1">Jumlah KK</p>
              <p className="text-2xl">45</p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Jumlah Jiwa</p>
              <p className="text-2xl">178</p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Ketua RT</p>
              <p className="text-sm">Pak Bambang</p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Periode</p>
              <p className="text-sm">2023-2026</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="pengumuman">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pengumuman">Pengumuman</TabsTrigger>
          <TabsTrigger value="kontak">Kontak</TabsTrigger>
          <TabsTrigger value="peraturan">Peraturan</TabsTrigger>
        </TabsList>

        {/* Pengumuman Tab */}
        <TabsContent value="pengumuman" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengumuman & Informasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pengumuman.map((item) => (
                <button
                  key={item.id}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    item.pinned
                      ? "border-yellow-300 bg-yellow-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {item.pinned && <Pin className="w-4 h-4 text-yellow-600" />}
                        <p className="text-gray-900">{item.judul}</p>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{item.isi}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            item.kategori === "kegiatan"
                              ? "border-blue-300 text-blue-700"
                              : item.kategori === "iuran"
                              ? "border-green-300 text-green-700"
                              : "border-purple-300 text-purple-700"
                          }
                        >
                          {item.kategori}
                        </Badge>
                        <Badge
                          className={
                            item.prioritas === "tinggi"
                              ? "bg-red-600"
                              : item.prioritas === "sedang"
                              ? "bg-orange-600"
                              : "bg-gray-600"
                          }
                        >
                          {item.prioritas}
                        </Badge>
                        <span className="text-xs text-gray-500">{item.tanggal}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kontak Tab */}
        <TabsContent value="kontak" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kontak Pengurus RT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {kontak.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{item.jabatan}</p>
                      <p className="text-gray-900 mb-1">{item.nama}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span>{item.telepon}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Hubungi
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kontak Darurat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-900 mb-2">🚨 Keamanan RT</p>
                  <p className="text-red-600">0815-6789-0123</p>
                </div>
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900 mb-2">🏥 Pos Kesehatan</p>
                  <p className="text-blue-600">0816-7890-1234</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Peraturan Tab */}
        <TabsContent value="peraturan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Peraturan RT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {peraturan.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 mb-1">{item.judul}</p>
                      <p className="text-sm text-gray-600">{item.isi}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-gray-900 mb-2">Perlu Dokumen Lengkap?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Download peraturan lengkap RT dalam format PDF
                </p>
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

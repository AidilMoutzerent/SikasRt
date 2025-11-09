import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Megaphone, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";

export function ManajemenInformasiPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<any>(null);

  const informasiData = {
    aktif: [
      {
        id: 1,
        judul: "Pengumuman Iuran Bulan November 2024",
        kategori: "Iuran",
        tanggal: "2024-11-01",
        konten: "Kepada seluruh warga RT 05, dimohon untuk segera melakukan pembayaran iuran bulan November 2024 sebesar Rp 25.000. Batas pembayaran tanggal 15 November 2024.",
        prioritas: "Tinggi",
        status: "Aktif",
        dibaca: 120
      },
      {
        id: 2,
        judul: "Jadwal Kerja Bakti - 17 November 2024",
        kategori: "Kegiatan",
        tanggal: "2024-11-05",
        konten: "Akan diadakan kerja bakti bersama pada hari Minggu, 17 November 2024 pukul 07:00 - 10:00. Diharapkan seluruh warga dapat berpartisipasi.",
        prioritas: "Sedang",
        status: "Aktif",
        dibaca: 95
      },
      {
        id: 3,
        judul: "Peningkatan Keamanan Lingkungan",
        kategori: "Keamanan",
        tanggal: "2024-11-03",
        konten: "Mohon kepada seluruh warga untuk selalu mengunci pintu dan pagar rumah. Laporkan segera jika melihat orang mencurigakan kepada petugas keamanan.",
        prioritas: "Tinggi",
        status: "Aktif",
        dibaca: 142
      },
    ],
    arsip: [
      {
        id: 4,
        judul: "Hasil Rapat RT Bulan Oktober",
        kategori: "Rapat",
        tanggal: "2024-10-02",
        konten: "Telah dilaksanakan rapat RT pada tanggal 1 Oktober 2024 dengan beberapa keputusan penting...",
        prioritas: "Sedang",
        status: "Arsip",
        dibaca: 87
      },
      {
        id: 5,
        judul: "Perayaan 17 Agustus 2024",
        kategori: "Kegiatan",
        tanggal: "2024-08-10",
        konten: "Dalam rangka memperingati HUT RI ke-79, akan diadakan berbagai lomba untuk seluruh warga...",
        prioritas: "Sedang",
        status: "Arsip",
        dibaca: 156
      },
    ]
  };

  const handleViewDetail = (info: any) => {
    setSelectedInfo(info);
    setShowDetailModal(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-gray-900 mb-1">Manajemen Informasi</h1>
            <p className="text-gray-600">Kelola pengumuman dan informasi RT 05 / RW 02</p>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Pengumuman
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pengumuman</p>
                  <h3 className="text-gray-900">28</h3>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pengumuman Aktif</p>
                  <h3 className="text-gray-900">3</h3>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Prioritas Tinggi</p>
                  <h3 className="text-gray-900">2</h3>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rata-rata Dibaca</p>
                  <h3 className="text-gray-900">119</h3>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Informasi</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="aktif">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="aktif">
                  Aktif ({informasiData.aktif.length})
                </TabsTrigger>
                <TabsTrigger value="arsip">
                  Arsip ({informasiData.arsip.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="aktif" className="mt-4 space-y-3">
                {informasiData.aktif.map((info) => (
                  <div key={info.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="text-gray-900">{info.judul}</h4>
                          <Badge 
                            variant="outline"
                            className={
                              info.kategori === "Iuran"
                                ? "bg-green-50 text-green-700 border-green-300"
                                : info.kategori === "Kegiatan"
                                ? "bg-blue-50 text-blue-700 border-blue-300"
                                : "bg-purple-50 text-purple-700 border-purple-300"
                            }
                          >
                            {info.kategori}
                          </Badge>
                          <Badge 
                            variant="outline"
                            className={
                              info.prioritas === "Tinggi"
                                ? "bg-red-50 text-red-700 border-red-300"
                                : "bg-yellow-50 text-yellow-700 border-yellow-300"
                            }
                          >
                            {info.prioritas}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{info.konten}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{info.tanggal}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>Dibaca {info.dibaca}x</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewDetail(info)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="arsip" className="mt-4 space-y-3">
                {informasiData.arsip.map((info) => (
                  <div key={info.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 opacity-75">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="text-gray-900">{info.judul}</h4>
                          <Badge 
                            variant="outline"
                            className={
                              info.kategori === "Rapat"
                                ? "bg-purple-50 text-purple-700 border-purple-300"
                                : "bg-blue-50 text-blue-700 border-blue-300"
                            }
                          >
                            {info.kategori}
                          </Badge>
                          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                            {info.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{info.konten}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{info.tanggal}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>Dibaca {info.dibaca}x</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewDetail(info)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Add Informasi Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buat Pengumuman Baru</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Judul Pengumuman</Label>
              <Input placeholder="Masukkan judul pengumuman" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iuran">Iuran</SelectItem>
                    <SelectItem value="kegiatan">Kegiatan</SelectItem>
                    <SelectItem value="keamanan">Keamanan</SelectItem>
                    <SelectItem value="rapat">Rapat</SelectItem>
                    <SelectItem value="umum">Umum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prioritas</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih prioritas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tinggi">Tinggi</SelectItem>
                    <SelectItem value="sedang">Sedang</SelectItem>
                    <SelectItem value="rendah">Rendah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Konten Pengumuman</Label>
              <Textarea 
                placeholder="Tulis isi pengumuman di sini..."
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label>Tanggal Publikasi</Label>
              <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                💡 Pengumuman akan langsung terlihat oleh seluruh warga setelah dipublikasikan
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowAddModal(false)}
              >
                Batal
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => {
                  alert("Pengumuman disimpan sebagai draft!");
                  setShowAddModal(false);
                }}
              >
                Simpan Draft
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  alert("Pengumuman berhasil dipublikasikan!");
                  setShowAddModal(false);
                }}
              >
                <Megaphone className="w-4 h-4 mr-2" />
                Publikasikan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Informasi Modal */}
      {selectedInfo && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Pengumuman</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge 
                    variant="outline"
                    className={
                      selectedInfo.kategori === "Iuran"
                        ? "bg-green-50 text-green-700 border-green-300"
                        : selectedInfo.kategori === "Kegiatan"
                        ? "bg-blue-50 text-blue-700 border-blue-300"
                        : "bg-purple-50 text-purple-700 border-purple-300"
                    }
                  >
                    {selectedInfo.kategori}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={
                      selectedInfo.prioritas === "Tinggi"
                        ? "bg-red-50 text-red-700 border-red-300"
                        : "bg-yellow-50 text-yellow-700 border-yellow-300"
                    }
                  >
                    Prioritas {selectedInfo.prioritas}
                  </Badge>
                </div>
                <h3 className="text-gray-900 mb-2">{selectedInfo.judul}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Dipublikasikan {selectedInfo.tanggal}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>Dibaca {selectedInfo.dibaca} kali</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-900 whitespace-pre-wrap">{selectedInfo.konten}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" className="flex-1 text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

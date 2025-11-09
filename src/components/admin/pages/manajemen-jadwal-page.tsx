import { useState } from "react";
import { Plus, Edit, Trash2, Calendar as CalendarIcon, Clock, MapPin, Truck, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";

export function ManajemenJadwalPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  // Data jadwal sampah
  const jadwalSampah = [
    {
      id: 1,
      hari: "Senin",
      waktu: "07:00 - 09:00",
      area: "Blok A & B",
      jenis: "Sampah Organik",
      petugas: "Tim Kebersihan 1",
      status: "Aktif"
    },
    {
      id: 2,
      hari: "Rabu",
      waktu: "07:00 - 09:00",
      area: "Blok C & D",
      jenis: "Sampah Organik",
      petugas: "Tim Kebersihan 2",
      status: "Aktif"
    },
    {
      id: 3,
      hari: "Jumat",
      waktu: "07:00 - 09:00",
      area: "Semua Blok",
      jenis: "Sampah Non-Organik",
      petugas: "Tim Kebersihan 1 & 2",
      status: "Aktif"
    },
    {
      id: 4,
      hari: "Sabtu",
      waktu: "08:00 - 12:00",
      area: "Semua Blok",
      jenis: "Bank Sampah",
      petugas: "Petugas Bank Sampah",
      status: "Aktif"
    },
  ];

  // Data jadwal keamanan/ronda
  const jadwalKeamanan = [
    {
      id: 1,
      hari: "Senin - Jumat",
      shift: "Shift Pagi",
      waktu: "06:00 - 14:00",
      petugas: "Budi Hartono",
      pos: "Pos Utama",
      status: "Aktif"
    },
    {
      id: 2,
      hari: "Senin - Jumat",
      shift: "Shift Sore",
      waktu: "14:00 - 22:00",
      petugas: "Taufik Rahman",
      pos: "Pos Utama",
      status: "Aktif"
    },
    {
      id: 3,
      hari: "Senin - Jumat",
      shift: "Shift Malam",
      waktu: "22:00 - 06:00",
      petugas: "Ronda Warga",
      pos: "Berkeliling",
      status: "Aktif"
    },
    {
      id: 4,
      hari: "Sabtu - Minggu",
      shift: "Full Day",
      waktu: "06:00 - 22:00",
      petugas: "Bergantian",
      pos: "Pos Utama",
      status: "Aktif"
    },
  ];

  // Data jadwal kegiatan
  const jadwalKegiatan = [
    {
      id: 1,
      nama: "Arisan RT",
      tanggal: "2024-11-15",
      waktu: "19:00 - 21:00",
      tempat: "Balai RT",
      peserta: "Semua Warga",
      status: "Akan Datang"
    },
    {
      id: 2,
      nama: "Kerja Bakti",
      tanggal: "2024-11-17",
      waktu: "07:00 - 10:00",
      tempat: "Lingkungan RT",
      peserta: "Semua Warga",
      status: "Akan Datang"
    },
    {
      id: 3,
      nama: "Posyandu",
      tanggal: "2024-11-20",
      waktu: "08:00 - 12:00",
      tempat: "Balai RT",
      peserta: "Ibu & Balita",
      status: "Akan Datang"
    },
    {
      id: 4,
      nama: "Rapat RT",
      tanggal: "2024-11-01",
      waktu: "19:00 - 21:00",
      tempat: "Balai RT",
      peserta: "Pengurus RT",
      status: "Selesai"
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-gray-900 mb-1">Manajemen Jadwal</h1>
            <p className="text-gray-600">Kelola jadwal kegiatan RT 05 / RW 02</p>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Jadwal
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Jadwal Sampah</p>
                  <h3 className="text-gray-900">4 Jadwal</h3>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Jadwal Keamanan</p>
                  <h3 className="text-gray-900">4 Shift</h3>
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
                  <p className="text-sm text-gray-600">Kegiatan Akan Datang</p>
                  <h3 className="text-gray-900">3 Kegiatan</h3>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Kegiatan Selesai</p>
                  <h3 className="text-gray-900">12 Kegiatan</h3>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Jadwal</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sampah">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sampah">Jadwal Sampah</TabsTrigger>
                <TabsTrigger value="keamanan">Jadwal Keamanan</TabsTrigger>
                <TabsTrigger value="kegiatan">Jadwal Kegiatan</TabsTrigger>
              </TabsList>

              <TabsContent value="sampah" className="mt-4 space-y-3">
                {jadwalSampah.map((jadwal) => (
                  <div key={jadwal.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-100 text-green-700 border-green-300" variant="outline">
                            {jadwal.hari}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                            {jadwal.jenis}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{jadwal.waktu}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{jadwal.area}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Truck className="w-4 h-4" />
                            <span>{jadwal.petugas}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
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

              <TabsContent value="keamanan" className="mt-4 space-y-3">
                {jadwalKeamanan.map((jadwal) => (
                  <div key={jadwal.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-blue-100 text-blue-700 border-blue-300" variant="outline">
                            {jadwal.shift}
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                            {jadwal.hari}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{jadwal.waktu}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{jadwal.pos}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <span>Petugas: {jadwal.petugas}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
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

              <TabsContent value="kegiatan" className="mt-4 space-y-3">
                {jadwalKegiatan.map((kegiatan) => (
                  <div key={kegiatan.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-gray-900">{kegiatan.nama}</h4>
                          <Badge 
                            className={
                              kegiatan.status === "Akan Datang"
                                ? "bg-green-100 text-green-700 border-green-300"
                                : "bg-gray-100 text-gray-700 border-gray-300"
                            }
                            variant="outline"
                          >
                            {kegiatan.status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{kegiatan.tanggal}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{kegiatan.waktu}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{kegiatan.tempat}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Peserta: {kegiatan.peserta}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
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
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Add Jadwal Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Jadwal Baru</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipe Jadwal</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe jadwal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sampah">Jadwal Pengangkutan Sampah</SelectItem>
                  <SelectItem value="keamanan">Jadwal Keamanan/Ronda</SelectItem>
                  <SelectItem value="kegiatan">Jadwal Kegiatan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nama Kegiatan/Jenis</Label>
                <Input placeholder="Contoh: Arisan RT, Sampah Organik" />
              </div>

              <div className="space-y-2">
                <Label>Hari</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih hari" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="senin">Senin</SelectItem>
                    <SelectItem value="selasa">Selasa</SelectItem>
                    <SelectItem value="rabu">Rabu</SelectItem>
                    <SelectItem value="kamis">Kamis</SelectItem>
                    <SelectItem value="jumat">Jumat</SelectItem>
                    <SelectItem value="sabtu">Sabtu</SelectItem>
                    <SelectItem value="minggu">Minggu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tanggal (untuk kegiatan)</Label>
                <Input type="date" />
              </div>

              <div className="space-y-2">
                <Label>Waktu</Label>
                <Input placeholder="Contoh: 07:00 - 09:00" />
              </div>

              <div className="space-y-2">
                <Label>Tempat/Area</Label>
                <Input placeholder="Contoh: Balai RT, Blok A & B" />
              </div>

              <div className="space-y-2">
                <Label>Petugas/Peserta</Label>
                <Input placeholder="Contoh: Tim Kebersihan 1" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Keterangan</Label>
              <Textarea placeholder="Tambahan informasi..." rows={3} />
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
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  alert("Jadwal berhasil ditambahkan!");
                  setShowAddModal(false);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Jadwal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

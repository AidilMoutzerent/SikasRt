import { Calendar as CalendarIcon, Truck, Users, Bell, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";

export function JadwalPage() {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);
  const [selectedKegiatan, setSelectedKegiatan] = useState<any>(null);

  const jadwalPengangkutan = [
    { id: 1, hari: "Rabu", tanggal: "6 Nov 2025", waktu: "07:00 - 09:00", status: "akan-datang" },
    { id: 2, hari: "Sabtu", tanggal: "9 Nov 2025", waktu: "07:00 - 09:00", status: "akan-datang" },
    { id: 3, hari: "Rabu", tanggal: "13 Nov 2025", waktu: "07:00 - 09:00", status: "dijadwalkan" },
    { id: 4, hari: "Sabtu", tanggal: "16 Nov 2025", waktu: "07:00 - 09:00", status: "dijadwalkan" },
  ];

  const jadwalKegiatan = [
    { 
      id: 1, 
      nama: "Kerja Bakti RT", 
      tanggal: "10 Nov 2025", 
      waktu: "06:00 - 08:00",
      lokasi: "Area RT 05",
      peserta: "Semua Warga",
      kategori: "wajib",
      deskripsi: "Kerja bakti membersihkan lingkungan RT. Bawalah peralatan seperti sapu dan cangkul."
    },
    { 
      id: 2, 
      nama: "Rapat RT Bulanan", 
      tanggal: "15 Nov 2025", 
      waktu: "19:00 - 21:00",
      lokasi: "Balai RT",
      peserta: "Ketua RT & Warga",
      kategori: "penting",
      deskripsi: "Rapat koordinasi dan evaluasi kegiatan RT bulan ini."
    },
    { 
      id: 3, 
      nama: "Senam Pagi Bersama", 
      tanggal: "12 Nov 2025", 
      waktu: "06:00 - 07:00",
      lokasi: "Lapangan RT",
      peserta: "Terbuka untuk Semua",
      kategori: "opsional",
      deskripsi: "Senam pagi rutin untuk menjaga kesehatan warga."
    },
    { 
      id: 4, 
      nama: "Posyandu", 
      tanggal: "20 Nov 2025", 
      waktu: "08:00 - 11:00",
      lokasi: "Pos Kesehatan RT",
      peserta: "Ibu & Balita",
      kategori: "penting",
      deskripsi: "Pemeriksaan kesehatan dan imunisasi untuk balita."
    },
  ];

  const riwayatKegiatan = [
    { id: 1, nama: "Kerja Bakti RT", tanggal: "27 Okt 2025", status: "hadir" },
    { id: 2, nama: "Rapat RT Bulanan", tanggal: "15 Okt 2025", status: "hadir" },
    { id: 3, nama: "17 Agustusan", tanggal: "17 Ags 2025", status: "hadir" },
  ];

  const handleSetReminder = (kegiatan: any) => {
    setSelectedKegiatan(kegiatan);
    setShowReminderModal(true);
    setReminderSet(false);
  };

  const handleConfirmReminder = () => {
    setReminderSet(true);
    setTimeout(() => {
      setShowReminderModal(false);
      setReminderSet(false);
    }, 2000);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-gray-900 mb-1">Jadwal</h1>
          <p className="text-gray-600">Lihat jadwal pengangkutan sampah dan kegiatan RT</p>
        </div>

        {/* Next Schedule Highlight */}
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <Truck className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <p className="text-sm opacity-90 mb-1">Jadwal Terdekat</p>
                <p className="text-2xl mb-2">Pengangkutan Sampah</p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Rabu, 6 November 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>07:00 - 09:00 WIB</span>
                  </div>
                </div>
              </div>
              <Button 
                className="bg-white text-orange-600 hover:bg-gray-100"
                onClick={() => handleSetReminder({ nama: "Pengangkutan Sampah", tanggal: "6 Nov 2025", waktu: "07:00 - 09:00" })}
              >
                <Bell className="w-4 h-4 mr-2" />
                Ingatkan Saya
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="pengangkutan">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pengangkutan">Pengangkutan</TabsTrigger>
            <TabsTrigger value="kegiatan">Kegiatan RT</TabsTrigger>
            <TabsTrigger value="riwayat">Riwayat</TabsTrigger>
          </TabsList>

          {/* Jadwal Pengangkutan */}
          <TabsContent value="pengangkutan" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Jadwal Pengangkutan Sampah</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-900">
                    <span className="font-medium">📅 Jadwal Rutin:</span> Setiap Rabu dan Sabtu pukul 07:00 - 09:00 WIB
                  </p>
                </div>

                {jadwalPengangkutan.map((jadwal) => (
                  <div
                    key={jadwal.id}
                    className={`p-4 border rounded-lg ${
                      jadwal.status === "akan-datang"
                        ? "border-orange-300 bg-orange-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          jadwal.status === "akan-datang"
                            ? "bg-orange-100"
                            : "bg-gray-100"
                        }`}>
                          <Truck className={`w-6 h-6 ${
                            jadwal.status === "akan-datang"
                              ? "text-orange-600"
                              : "text-gray-600"
                          }`} />
                        </div>
                        <div>
                          <p className="text-gray-900 mb-1">{jadwal.hari}, {jadwal.tanggal}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-3 h-3" />
                            <span>{jadwal.waktu}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge
                          className={
                            jadwal.status === "akan-datang"
                              ? "bg-orange-600"
                              : "bg-gray-600"
                          }
                        >
                          {jadwal.status === "akan-datang" ? "Segera" : "Dijadwalkan"}
                        </Badge>
                        {jadwal.status === "akan-datang" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleSetReminder({ nama: "Pengangkutan Sampah", tanggal: jadwal.tanggal, waktu: jadwal.waktu })}
                          >
                            <Bell className="w-3 h-3 mr-1" />
                            Ingatkan
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kegiatan RT */}
          <TabsContent value="kegiatan" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Kegiatan RT Mendatang</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {jadwalKegiatan.map((kegiatan) => (
                  <div
                    key={kegiatan.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          kegiatan.kategori === "wajib"
                            ? "bg-red-100"
                            : kegiatan.kategori === "penting"
                            ? "bg-orange-100"
                            : "bg-blue-100"
                        }`}>
                          <Users className={`w-6 h-6 ${
                            kegiatan.kategori === "wajib"
                              ? "text-red-600"
                              : kegiatan.kategori === "penting"
                              ? "text-orange-600"
                              : "text-blue-600"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-gray-900">{kegiatan.nama}</p>
                            <Badge
                              variant="outline"
                              className={
                                kegiatan.kategori === "wajib"
                                  ? "border-red-300 text-red-700"
                                  : kegiatan.kategori === "penting"
                                  ? "border-orange-300 text-orange-700"
                                  : "border-blue-300 text-blue-700"
                              }
                            >
                              {kegiatan.kategori}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-3 h-3" />
                              <span>{kegiatan.tanggal}</span>
                              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                              <Clock className="w-3 h-3" />
                              <span>{kegiatan.waktu}</span>
                            </div>
                            <p>📍 {kegiatan.lokasi}</p>
                            <p>👥 {kegiatan.peserta}</p>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetReminder(kegiatan)}
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        Ingatkan
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Riwayat */}
          <TabsContent value="riwayat" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Kehadiran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {riwayatKegiatan.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-gray-900 mb-1">{item.nama}</p>
                        <p className="text-sm text-gray-600">{item.tanggal}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600">
                      ✓ {item.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Reminder Modal */}
      <Dialog open={showReminderModal} onOpenChange={setShowReminderModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {reminderSet ? "Pengingat Diatur!" : "Atur Pengingat"}
            </DialogTitle>
          </DialogHeader>

          {!reminderSet ? (
            <div className="space-y-4">
              {selectedKegiatan && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 mb-2">{selectedKegiatan.nama}</p>
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{selectedKegiatan.tanggal}</span>
                    {selectedKegiatan.waktu && (
                      <>
                        <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                        <Clock className="w-4 h-4" />
                        <span>{selectedKegiatan.waktu}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm text-gray-600">Kapan Anda ingin diingatkan?</p>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleConfirmReminder}
                >
                  <Bell className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">1 jam sebelumnya</p>
                    <p className="text-xs text-gray-600">Notifikasi push</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleConfirmReminder}
                >
                  <Bell className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Malam sebelumnya</p>
                    <p className="text-xs text-gray-600">Pukul 20:00 WIB</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleConfirmReminder}
                >
                  <Bell className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">1 hari sebelumnya</p>
                    <p className="text-xs text-gray-600">Pukul 09:00 WIB</p>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Pengingat Berhasil Diatur!</h3>
              <p className="text-gray-600">
                Kami akan mengirimkan notifikasi sesuai jadwal yang Anda pilih
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

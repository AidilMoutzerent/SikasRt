import { Truck, Megaphone, Calendar, ChevronRight, Bell, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState } from "react";

export function QuickInfoSection() {
  const [showPengumumanModal, setShowPengumumanModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);
  const [selectedPengumuman, setSelectedPengumuman] = useState<any>(null);

  const announcements = [
    {
      id: 1,
      title: "Kerja Bakti Minggu Ini",
      date: "5 November 2025",
      category: "Kegiatan",
      content: "Kerja bakti akan diadakan pada hari Minggu, 10 November 2025 pukul 06:00 - 08:00 WIB di area RT 05. Mohon kehadiran seluruh warga untuk membersihkan lingkungan bersama. Bawalah peralatan seperti sapu, cangkul, dan kantong sampah.",
      author: "Pak Bambang - Ketua RT"
    },
    {
      id: 2,
      title: "Perbaikan Jalan Mulai Senin",
      date: "3 November 2025",
      category: "Pengumuman",
      content: "Perbaikan jalan di area RT akan dimulai pada Senin, 11 November 2025 dan diperkirakan selesai dalam 2 minggu. Harap berhati-hati saat melewati area konstruksi dan ikuti petunjuk dari petugas.",
      author: "Pak Ahmad - Bendahara"
    }
  ];

  const handleOpenPengumuman = (announcement: any) => {
    setSelectedPengumuman(announcement);
    setShowPengumumanModal(true);
  };

  const handleSetReminder = () => {
    setReminderSet(true);
    setTimeout(() => {
      setShowReminderModal(false);
      setReminderSet(false);
    }, 2000);
  };
  
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jadwal Pengangkutan */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-orange-600" />
              </div>
              <CardTitle>Jadwal Pengangkutan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm text-orange-900 mb-1">Pengangkutan sampah berikutnya:</p>
                  <p className="text-orange-900">Rabu, 6 November 2025</p>
                  <p className="text-sm text-orange-700 mt-1">Pukul 07:00 - 09:00 WIB</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowReminderModal(true)}
              >
                <Bell className="w-4 h-4 mr-2" />
                Ingatkan Saya
              </Button>
              <Button variant="outline" className="w-full">
                Lihat Jadwal
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Pengumuman Terbaru */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-purple-600" />
              </div>
              <CardTitle>Pengumuman Terbaru</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.map((announcement) => (
              <button
                key={announcement.id}
                onClick={() => handleOpenPengumuman(announcement)}
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-gray-900 mb-1">{announcement.title}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{announcement.date}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>{announcement.category}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            ))}
            
            <Button variant="outline" className="w-full mt-2">
              Lihat Semua Pengumuman
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pengumuman Detail Modal */}
      <Dialog open={showPengumumanModal} onOpenChange={setShowPengumumanModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedPengumuman?.title}</DialogTitle>
          </DialogHeader>

          {selectedPengumuman && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{selectedPengumuman.date}</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span>{selectedPengumuman.category}</span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  {selectedPengumuman.content}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 pt-4 border-t">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
                <span>{selectedPengumuman.author}</span>
              </div>

              <Button 
                className="w-full"
                onClick={() => setShowPengumumanModal(false)}
              >
                Tutup
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Truck className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-orange-900 mb-1">Pengangkutan Sampah</p>
                    <p className="text-orange-900">Rabu, 6 November 2025</p>
                    <p className="text-sm text-orange-700">Pukul 07:00 - 09:00 WIB</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-600">Kapan Anda ingin diingatkan?</p>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleSetReminder}
                >
                  <Bell className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">1 jam sebelumnya</p>
                    <p className="text-xs text-gray-600">Rabu, 06:00 WIB</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleSetReminder}
                >
                  <Bell className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Malam sebelumnya</p>
                    <p className="text-xs text-gray-600">Selasa, 20:00 WIB</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleSetReminder}
                >
                  <Bell className="w-4 h-4 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">1 hari sebelumnya</p>
                    <p className="text-xs text-gray-600">Selasa, 07:00 WIB</p>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-green-600" />
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

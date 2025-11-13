import { Truck, Megaphone, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function QuickInfoSection() {
  // Data akan diambil dari API - saat ini kosong
  const jadwal: any[] = [];
  const pengumuman: any[] = [];
  
  return (
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
        <CardContent>
          {jadwal.length > 0 ? (
            <div className="space-y-3">
              {jadwal.map((item) => (
                <div key={item.id} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <p className="text-sm text-orange-900">{item.hari}</p>
                  <p className="text-orange-900">{item.waktu}</p>
                  <p className="text-sm text-orange-700">{item.jenisSampah}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Inbox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-600">Belum ada jadwal pengangkutan</p>
              <p className="text-xs text-gray-500 mt-1">Admin akan membuat jadwal segera</p>
            </div>
          )}
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
        <CardContent>
          {pengumuman.length > 0 ? (
            <div className="space-y-3">
              {pengumuman.map((item) => (
                <div key={item.id} className="p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                  <p className="text-sm text-gray-900">{item.judul}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.tanggal}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Inbox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-600">Belum ada pengumuman</p>
              <p className="text-xs text-gray-500 mt-1">Pengumuman dari admin akan muncul di sini</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { Calendar as CalendarIcon, Truck, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function JadwalPage() {
  // Data akan diambil dari API - saat ini kosong
  const jadwalPengangkutan: any[] = [];
  const jadwalKegiatan: any[] = [];
  const riwayatKegiatan: any[] = [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Jadwal & Kegiatan</h1>
        <p className="text-gray-600">Lihat jadwal pengangkutan sampah dan kegiatan RT</p>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Jadwal</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pengangkutan" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pengangkutan">Pengangkutan</TabsTrigger>
              <TabsTrigger value="kegiatan">Kegiatan RT</TabsTrigger>
              <TabsTrigger value="riwayat">Riwayat</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pengangkutan" className="space-y-4">
              {jadwalPengangkutan.length > 0 ? (
                <div className="space-y-3">
                  {jadwalPengangkutan.map((item) => (
                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg flex items-center gap-4">
                      <Truck className="w-8 h-8 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-900">{item.hari}</p>
                        <p className="text-xs text-gray-500">{item.waktu}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-gray-900 mb-2">Belum Ada Jadwal Pengangkutan</h3>
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    Jadwal pengangkutan sampah akan dibuat oleh admin dan akan muncul di sini.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="kegiatan" className="space-y-4">
              {jadwalKegiatan.length > 0 ? (
                <div className="space-y-3">
                  {jadwalKegiatan.map((item) => (
                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-900">{item.nama}</p>
                      <p className="text-xs text-gray-500">{item.tanggal}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-gray-900 mb-2">Belum Ada Kegiatan RT</h3>
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    Informasi kegiatan RT akan dibuat oleh admin dan akan muncul di sini.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="riwayat" className="space-y-4">
              {riwayatKegiatan.length > 0 ? (
                <div className="space-y-3">
                  {riwayatKegiatan.map((item) => (
                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-900">{item.nama}</p>
                      <p className="text-xs text-gray-500">{item.tanggal}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-gray-900 mb-2">Belum Ada Riwayat</h3>
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    Riwayat kegiatan yang Anda ikuti akan muncul di sini.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

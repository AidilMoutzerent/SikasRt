import { Megaphone, MapPin, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function InformasiRTPage() {
  // Data akan diambil dari API - saat ini kosong
  const pengumuman: any[] = [];
  const kontak: any[] = [];
  const peraturan: any[] = [];

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
              <p className="text-2xl">0</p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Jumlah Jiwa</p>
              <p className="text-2xl">0</p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Ketua RT</p>
              <p className="text-sm">-</p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Periode</p>
              <p className="text-sm">-</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi & Kontak</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pengumuman" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pengumuman">Pengumuman</TabsTrigger>
              <TabsTrigger value="kontak">Kontak</TabsTrigger>
              <TabsTrigger value="peraturan">Peraturan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pengumuman" className="space-y-4">
              {pengumuman.length > 0 ? (
                <div className="space-y-3">
                  {pengumuman.map((item) => (
                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-900">{item.judul}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.tanggal}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-gray-900 mb-2">Belum Ada Pengumuman</h3>
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    Pengumuman dari admin RT akan muncul di sini.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="kontak" className="space-y-4">
              {kontak.length > 0 ? (
                <div className="space-y-3">
                  {kontak.map((item, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-900">{item.jabatan}</p>
                      <p className="text-xs text-gray-600">{item.nama}</p>
                      <p className="text-xs text-gray-500">{item.telepon}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-gray-900 mb-2">Belum Ada Kontak</h3>
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    Daftar kontak pengurus RT akan diisi oleh admin.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="peraturan" className="space-y-4">
              {peraturan.length > 0 ? (
                <div className="space-y-3">
                  {peraturan.map((item) => (
                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-900">{item.judul}</p>
                      <p className="text-xs text-gray-600 mt-1">{item.isi}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-gray-900 mb-2">Belum Ada Peraturan</h3>
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    Peraturan RT akan diisi oleh admin.
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

import { useState } from "react";
import { Plus, Send, CheckCircle, XCircle, Clock, Filter, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";

export function ManajemenIuranPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  const pembayaranData = {
    lunas: [
      { id: 1, nama: "Budi Santoso", alamat: "Jl. Melati No. 15", nominal: 25000, tanggal: "2024-11-01", metode: "QRIS", avatar: "Budi" },
      { id: 2, nama: "Dewi Lestari", alamat: "Jl. Dahlia No. 12", nominal: 25000, tanggal: "2024-11-02", metode: "Transfer", avatar: "Dewi" },
      { id: 3, nama: "Andi Wijaya", alamat: "Jl. Anggrek No. 8", nominal: 25000, tanggal: "2024-11-03", metode: "QRIS", avatar: "Andi" },
    ],
    belum: [
      { id: 1, nama: "Siti Nurhaliza", alamat: "Jl. Mawar No. 20", nominal: 25000, avatar: "Siti" },
      { id: 2, nama: "Rudi Hermawan", alamat: "Jl. Kenanga No. 5", nominal: 25000, avatar: "Rudi" },
    ],
    pending: [
      { id: 1, nama: "Ahmad Fauzi", alamat: "Jl. Teratai No. 7", nominal: 25000, tanggal: "2024-11-05", metode: "Transfer", avatar: "Ahmad" },
    ]
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-gray-900 mb-1">Manajemen Iuran</h1>
            <p className="text-gray-600">Kelola tagihan dan pembayaran iuran warga</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowReminderModal(true)}
            >
              <Send className="w-4 h-4 mr-2" />
              Kirim Pengingat
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Tagihan
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tagihan</p>
                  <h3 className="text-gray-900">Rp 3,75 Jt</h3>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sudah Lunas</p>
                  <h3 className="text-gray-900">Rp 3,5 Jt</h3>
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
                  <p className="text-sm text-gray-600">Belum Bayar</p>
                  <h3 className="text-gray-900">Rp 250 Rb</h3>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <h3 className="text-gray-900">1 Warga</h3>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs untuk status pembayaran */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pembayaran - November 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="lunas">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="lunas">
                  Lunas ({pembayaranData.lunas.length})
                </TabsTrigger>
                <TabsTrigger value="belum">
                  Belum Bayar ({pembayaranData.belum.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({pembayaranData.pending.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lunas" className="space-y-3 mt-4">
                {pembayaranData.lunas.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.avatar}`} />
                        <AvatarFallback>{item.nama.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-gray-900">{item.nama}</p>
                        <p className="text-sm text-gray-600">{item.alamat}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900">Rp {item.nominal.toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          {item.metode}
                        </Badge>
                        <span className="text-xs text-gray-600">{item.tanggal}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="belum" className="space-y-3 mt-4">
                {pembayaranData.belum.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.avatar}`} />
                        <AvatarFallback>{item.nama.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-gray-900">{item.nama}</p>
                        <p className="text-sm text-gray-600">{item.alamat}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-gray-900">Rp {item.nominal.toLocaleString()}</p>
                        <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 mt-1">
                          Belum Bayar
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        <Send className="w-4 h-4 mr-1" />
                        Kirim Reminder
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="pending" className="space-y-3 mt-4">
                {pembayaranData.pending.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-purple-200 rounded-lg bg-purple-50">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.avatar}`} />
                        <AvatarFallback>{item.nama.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-gray-900">{item.nama}</p>
                        <p className="text-sm text-gray-600">{item.alamat}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-gray-900">Rp {item.nominal.toLocaleString()}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                            {item.metode}
                          </Badge>
                          <span className="text-xs text-gray-600">{item.tanggal}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Verifikasi
                        </Button>
                        <Button size="sm" variant="outline">
                          Tolak
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

      {/* Create Tagihan Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Buat Tagihan Iuran Baru</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Periode</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nov-2024">November 2024</SelectItem>
                  <SelectItem value="dec-2024">Desember 2024</SelectItem>
                  <SelectItem value="jan-2025">Januari 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nominal Iuran</Label>
              <Input type="number" placeholder="25000" defaultValue="25000" />
            </div>

            <div className="space-y-2">
              <Label>Tanggal Jatuh Tempo</Label>
              <Input type="date" />
            </div>

            <div className="space-y-2">
              <Label>Keterangan</Label>
              <Textarea placeholder="Contoh: Iuran kebersihan dan keamanan bulanan" rows={3} />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                💡 Tagihan akan dibuat untuk semua warga aktif (150 warga)
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowCreateModal(false)}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  alert("Tagihan berhasil dibuat untuk 150 warga!");
                  setShowCreateModal(false);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Tagihan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Reminder Modal */}
      <Dialog open={showReminderModal} onOpenChange={setShowReminderModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Kirim Pengingat Pembayaran</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tujuan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tujuan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Warga Belum Bayar (10 Warga)</SelectItem>
                  <SelectItem value="selected">Warga Tertentu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Metode Pengiriman</Label>
              <Select defaultValue="whatsapp">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="both">WhatsApp & Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pesan</Label>
              <Textarea 
                placeholder="Pesan pengingat..."
                rows={4}
                defaultValue="Yth. Bapak/Ibu Warga RT 05, Ini adalah pengingat pembayaran iuran bulan November 2024 sebesar Rp 25.000. Mohon segera melakukan pembayaran. Terima kasih."
              />
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-900">
                ⚠️ Pengingat akan dikirim ke 10 warga yang belum membayar
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowReminderModal(false)}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  alert("Pengingat berhasil dikirim!");
                  setShowReminderModal(false);
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Kirim Pengingat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

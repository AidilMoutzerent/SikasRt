import { useState } from "react";
import { Plus, Send, CheckCircle, XCircle, Clock, Filter, Calendar, DollarSign, Edit, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { toast } from "sonner@2.0.3";

interface Pembayaran {
  id: number;
  nama: string;
  alamat: string;
  nominal: number;
  tanggal?: string;
  metode?: string;
  avatar: string;
  status: "Lunas" | "Belum Bayar" | "Pending";
}

export function ManajemenIuranPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedPembayaran, setSelectedPembayaran] = useState<Pembayaran | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  const [pembayaranData, setPembayaranData] = useState<Pembayaran[]>([
    { id: 1, nama: "Budi Santoso", alamat: "Jl. Melati No. 15", nominal: 25000, tanggal: "2024-11-01", metode: "QRIS", avatar: "Budi", status: "Lunas" },
    { id: 2, nama: "Dewi Lestari", alamat: "Jl. Dahlia No. 12", nominal: 25000, tanggal: "2024-11-02", metode: "Transfer", avatar: "Dewi", status: "Lunas" },
    { id: 3, nama: "Andi Wijaya", alamat: "Jl. Anggrek No. 8", nominal: 25000, tanggal: "2024-11-03", metode: "QRIS", avatar: "Andi", status: "Lunas" },
    { id: 4, nama: "Siti Nurhaliza", alamat: "Jl. Mawar No. 20", nominal: 25000, avatar: "Siti", status: "Belum Bayar" },
    { id: 5, nama: "Rudi Hermawan", alamat: "Jl. Kenanga No. 5", nominal: 25000, avatar: "Rudi", status: "Belum Bayar" },
    { id: 6, nama: "Ahmad Fauzi", alamat: "Jl. Teratai No. 7", nominal: 25000, tanggal: "2024-11-05", metode: "Transfer", avatar: "Ahmad", status: "Pending" },
  ]);

  const [formTagihan, setFormTagihan] = useState({
    bulan: "",
    tahun: "2024",
    nominal: "25000",
    deskripsi: "",
    batasPembayaran: ""
  });

  const lunas = pembayaranData.filter(p => p.status === "Lunas");
  const belumBayar = pembayaranData.filter(p => p.status === "Belum Bayar");
  const pending = pembayaranData.filter(p => p.status === "Pending");

  const handleViewDetail = (pembayaran: Pembayaran) => {
    setSelectedPembayaran(pembayaran);
    setShowDetailModal(true);
  };

  const handleApprovePembayaran = (pembayaran: Pembayaran) => {
    setSelectedPembayaran(pembayaran);
    setActionType("approve");
    setShowConfirmDialog(true);
  };

  const handleRejectPembayaran = (pembayaran: Pembayaran) => {
    setSelectedPembayaran(pembayaran);
    setActionType("reject");
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    if (!selectedPembayaran) return;

    const updatedData = pembayaranData.map(p =>
      p.id === selectedPembayaran.id
        ? {
            ...p,
            status: actionType === "approve" ? "Lunas" as const : "Belum Bayar" as const,
            tanggal: actionType === "approve" ? new Date().toISOString().split('T')[0] : undefined
          }
        : p
    );

    setPembayaranData(updatedData);
    toast.success(
      actionType === "approve" 
        ? "Pembayaran berhasil disetujui!" 
        : "Pembayaran ditolak!"
    );
    setShowConfirmDialog(false);
    setSelectedPembayaran(null);
    setActionType(null);
  };

  const handleCreateTagihan = () => {
    if (!formTagihan.bulan || !formTagihan.tahun || !formTagihan.nominal || !formTagihan.batasPembayaran) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    toast.success(`Tagihan ${formTagihan.bulan} ${formTagihan.tahun} berhasil dibuat untuk semua warga!`);
    setShowCreateModal(false);
    resetForm();
  };

  const handleSendReminder = () => {
    const count = belumBayar.length;
    toast.success(`Pengingat berhasil dikirim ke ${count} warga yang belum membayar!`);
    setShowReminderModal(false);
  };

  const resetForm = () => {
    setFormTagihan({
      bulan: "",
      tahun: "2024",
      nominal: "25000",
      deskripsi: "",
      batasPembayaran: ""
    });
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
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Tagihan Baru
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
                  <h3 className="text-gray-900">Rp {(pembayaranData.length * 25000).toLocaleString()}</h3>
                  <p className="text-sm text-gray-500 mt-1">{pembayaranData.length} warga</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sudah Lunas</p>
                  <h3 className="text-gray-900">Rp {(lunas.length * 25000).toLocaleString()}</h3>
                  <p className="text-sm text-green-600 mt-1">{lunas.length} warga ({Math.round((lunas.length / pembayaranData.length) * 100)}%)</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Belum Bayar</p>
                  <h3 className="text-gray-900">Rp {(belumBayar.length * 25000).toLocaleString()}</h3>
                  <p className="text-sm text-red-600 mt-1">{belumBayar.length} warga</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Verifikasi</p>
                  <h3 className="text-gray-900">{pending.length}</h3>
                  <p className="text-sm text-orange-600 mt-1">Perlu diverifikasi</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Status Pembayaran - November 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">
                  <Clock className="w-4 h-4 mr-2" />
                  Pending ({pending.length})
                </TabsTrigger>
                <TabsTrigger value="lunas">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Lunas ({lunas.length})
                </TabsTrigger>
                <TabsTrigger value="belum">
                  <XCircle className="w-4 h-4 mr-2" />
                  Belum Bayar ({belumBayar.length})
                </TabsTrigger>
              </TabsList>

              {/* Pending Tab */}
              <TabsContent value="pending" className="mt-4 space-y-3">
                {pending.map((pembayaran) => (
                  <Card key={pembayaran.id} className="hover:shadow-md transition-shadow border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${pembayaran.avatar}`} />
                            <AvatarFallback>{pembayaran.nama.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-gray-900">{pembayaran.nama}</p>
                            <p className="text-sm text-gray-600">{pembayaran.alamat}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
                                {pembayaran.metode}
                              </Badge>
                              <span className="text-sm text-gray-500">{pembayaran.tanggal}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <p className="text-gray-900">Rp {pembayaran.nominal.toLocaleString()}</p>
                            <Badge className="bg-orange-100 text-orange-700 mt-1">
                              Pending
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewDetail(pembayaran)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprovePembayaran(pembayaran)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Setujui
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleRejectPembayaran(pembayaran)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {pending.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Tidak ada pembayaran yang perlu diverifikasi
                  </div>
                )}
              </TabsContent>

              {/* Lunas Tab */}
              <TabsContent value="lunas" className="mt-4 space-y-3">
                {lunas.map((pembayaran) => (
                  <Card key={pembayaran.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${pembayaran.avatar}`} />
                            <AvatarFallback>{pembayaran.nama.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-gray-900">{pembayaran.nama}</p>
                            <p className="text-sm text-gray-600">{pembayaran.alamat}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                                {pembayaran.metode}
                              </Badge>
                              <span className="text-sm text-gray-500">{pembayaran.tanggal}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900">Rp {pembayaran.nominal.toLocaleString()}</p>
                          <Badge className="bg-green-100 text-green-700 mt-1">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Lunas
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Belum Bayar Tab */}
              <TabsContent value="belum" className="mt-4 space-y-3">
                {belumBayar.map((pembayaran) => (
                  <Card key={pembayaran.id} className="hover:shadow-md transition-shadow border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${pembayaran.avatar}`} />
                            <AvatarFallback>{pembayaran.nama.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-gray-900">{pembayaran.nama}</p>
                            <p className="text-sm text-gray-600">{pembayaran.alamat}</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <p className="text-gray-900">Rp {pembayaran.nominal.toLocaleString()}</p>
                            <Badge className="bg-red-100 text-red-700 mt-1">
                              <XCircle className="w-3 h-3 mr-1" />
                              Belum Bayar
                            </Badge>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toast.info(`Pengingat dikirim ke ${pembayaran.nama}`)}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Ingatkan
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Create Tagihan Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Buat Tagihan Iuran Baru</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bulan *</Label>
                <Select value={formTagihan.bulan} onValueChange={(value) => setFormTagihan({...formTagihan, bulan: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Januari">Januari</SelectItem>
                    <SelectItem value="Februari">Februari</SelectItem>
                    <SelectItem value="Maret">Maret</SelectItem>
                    <SelectItem value="April">April</SelectItem>
                    <SelectItem value="Mei">Mei</SelectItem>
                    <SelectItem value="Juni">Juni</SelectItem>
                    <SelectItem value="Juli">Juli</SelectItem>
                    <SelectItem value="Agustus">Agustus</SelectItem>
                    <SelectItem value="September">September</SelectItem>
                    <SelectItem value="Oktober">Oktober</SelectItem>
                    <SelectItem value="November">November</SelectItem>
                    <SelectItem value="Desember">Desember</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tahun *</Label>
                <Input 
                  type="number"
                  value={formTagihan.tahun}
                  onChange={(e) => setFormTagihan({...formTagihan, tahun: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nominal (Rp) *</Label>
              <Input 
                type="number"
                placeholder="25000"
                value={formTagihan.nominal}
                onChange={(e) => setFormTagihan({...formTagihan, nominal: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Batas Pembayaran *</Label>
              <Input 
                type="date"
                value={formTagihan.batasPembayaran}
                onChange={(e) => setFormTagihan({...formTagihan, batasPembayaran: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Deskripsi (Opsional)</Label>
              <Textarea 
                placeholder="Catatan tambahan untuk tagihan ini..."
                value={formTagihan.deskripsi}
                onChange={(e) => setFormTagihan({...formTagihan, deskripsi: e.target.value})}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900">
                💡 Tagihan akan dibuat untuk semua warga yang terdaftar
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleCreateTagihan}
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Tagihan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reminder Modal */}
      <Dialog open={showReminderModal} onOpenChange={setShowReminderModal}>
        <DialogContent className="max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Kirim Pengingat Pembayaran</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-orange-900 mb-2">
                Pengingat akan dikirim ke <strong>{belumBayar.length} warga</strong> yang belum membayar iuran November 2024
              </p>
              <div className="space-y-1">
                {belumBayar.slice(0, 3).map(w => (
                  <p key={w.id} className="text-sm text-orange-800">• {w.nama}</p>
                ))}
                {belumBayar.length > 3 && (
                  <p className="text-sm text-orange-800">• dan {belumBayar.length - 3} warga lainnya</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Metode Pengiriman</Label>
              <Select defaultValue="whatsapp">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pesan (Opsional)</Label>
              <Textarea 
                placeholder="Tambahkan pesan khusus..."
                className="min-h-20"
              />
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
                onClick={handleSendReminder}
              >
                <Send className="w-4 h-4 mr-2" />
                Kirim Sekarang
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      {selectedPembayaran && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-md" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Detail Pembayaran</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPembayaran.avatar}`} />
                  <AvatarFallback>{selectedPembayaran.nama.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-gray-900">{selectedPembayaran.nama}</p>
                  <p className="text-sm text-gray-600">{selectedPembayaran.alamat}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nominal</p>
                  <p className="text-gray-900">Rp {selectedPembayaran.nominal.toLocaleString()}</p>
                </div>

                {selectedPembayaran.tanggal && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tanggal Pembayaran</p>
                    <p className="text-gray-900">{selectedPembayaran.tanggal}</p>
                  </div>
                )}

                {selectedPembayaran.metode && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Metode Pembayaran</p>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                      {selectedPembayaran.metode}
                    </Badge>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <Badge className={
                    selectedPembayaran.status === "Lunas" 
                      ? "bg-green-100 text-green-700" 
                      : selectedPembayaran.status === "Pending"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-red-100 text-red-700"
                  }>
                    {selectedPembayaran.status}
                  </Badge>
                </div>
              </div>

              {selectedPembayaran.status === "Pending" && (
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700"
                    onClick={() => {
                      setShowDetailModal(false);
                      handleRejectPembayaran(selectedPembayaran);
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Tolak
                  </Button>
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setShowDetailModal(false);
                      handleApprovePembayaran(selectedPembayaran);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Setujui
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirm Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approve" ? "Setujui Pembayaran" : "Tolak Pembayaran"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "approve" 
                ? `Apakah Anda yakin ingin menyetujui pembayaran dari ${selectedPembayaran?.nama}? Status akan berubah menjadi Lunas.`
                : `Apakah Anda yakin ingin menolak pembayaran dari ${selectedPembayaran?.nama}? Status akan berubah menjadi Belum Bayar.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={actionType === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {actionType === "approve" ? "Ya, Setujui" : "Ya, Tolak"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

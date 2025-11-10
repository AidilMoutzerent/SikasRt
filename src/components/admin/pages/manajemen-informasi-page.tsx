import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Megaphone, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
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

interface Informasi {
  id: number;
  judul: string;
  kategori: string;
  tanggal: string;
  konten: string;
  prioritas: string;
  status: string;
  dibaca: number;
}

export function ManajemenInformasiPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<Informasi | null>(null);

  const [informasiData, setInformasiData] = useState<Informasi[]>([
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
  ]);

  const [formData, setFormData] = useState({
    judul: "",
    kategori: "",
    tanggal: "",
    konten: "",
    prioritas: "Sedang",
    status: "Aktif"
  });

  const informasiAktif = informasiData.filter(i => i.status === "Aktif");
  const informasiArsip = informasiData.filter(i => i.status === "Arsip");

  const handleViewDetail = (info: Informasi) => {
    setSelectedInfo(info);
    setShowDetailModal(true);
  };

  const handleEdit = (info: Informasi) => {
    setSelectedInfo(info);
    setFormData({
      judul: info.judul,
      kategori: info.kategori,
      tanggal: info.tanggal,
      konten: info.konten,
      prioritas: info.prioritas,
      status: info.status
    });
    setShowEditModal(true);
  };

  const handleDelete = (info: Informasi) => {
    setSelectedInfo(info);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedInfo) {
      setInformasiData(informasiData.filter(i => i.id !== selectedInfo.id));
      toast.success("Informasi berhasil dihapus!");
      setShowDeleteDialog(false);
      setSelectedInfo(null);
    }
  };

  const handleAddInformasi = () => {
    if (!formData.judul || !formData.kategori || !formData.tanggal || !formData.konten) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    const newInfo: Informasi = {
      id: Math.max(...informasiData.map(i => i.id)) + 1,
      judul: formData.judul,
      kategori: formData.kategori,
      tanggal: formData.tanggal,
      konten: formData.konten,
      prioritas: formData.prioritas,
      status: formData.status,
      dibaca: 0
    };

    setInformasiData([...informasiData, newInfo]);
    toast.success("Informasi berhasil ditambahkan!");
    setShowAddModal(false);
    resetForm();
  };

  const handleUpdateInformasi = () => {
    if (!selectedInfo) return;

    if (!formData.judul || !formData.kategori || !formData.tanggal || !formData.konten) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    const updatedData = informasiData.map(i =>
      i.id === selectedInfo.id
        ? {
            ...i,
            judul: formData.judul,
            kategori: formData.kategori,
            tanggal: formData.tanggal,
            konten: formData.konten,
            prioritas: formData.prioritas,
            status: formData.status
          }
        : i
    );

    setInformasiData(updatedData);
    toast.success("Informasi berhasil diupdate!");
    setShowEditModal(false);
    setSelectedInfo(null);
    resetForm();
  };

  const handleArchive = (info: Informasi) => {
    const updatedData = informasiData.map(i =>
      i.id === info.id ? { ...i, status: "Arsip" } : i
    );
    setInformasiData(updatedData);
    toast.success("Informasi dipindahkan ke arsip!");
  };

  const handleActivate = (info: Informasi) => {
    const updatedData = informasiData.map(i =>
      i.id === info.id ? { ...i, status: "Aktif" } : i
    );
    setInformasiData(updatedData);
    toast.success("Informasi diaktifkan kembali!");
  };

  const resetForm = () => {
    setFormData({
      judul: "",
      kategori: "",
      tanggal: "",
      konten: "",
      prioritas: "Sedang",
      status: "Aktif"
    });
  };

  const getPriorityBadge = (prioritas: string) => {
    const colors = {
      "Tinggi": "bg-red-100 text-red-700 border-red-300",
      "Sedang": "bg-yellow-100 text-yellow-700 border-yellow-300",
      "Rendah": "bg-blue-100 text-blue-700 border-blue-300"
    };
    return colors[prioritas as keyof typeof colors] || colors.Sedang;
  };

  const getCategoryIcon = (kategori: string) => {
    const icons = {
      "Iuran": AlertCircle,
      "Kegiatan": CheckCircle,
      "Keamanan": AlertCircle,
      "Rapat": Megaphone,
      "Umum": Megaphone
    };
    const Icon = icons[kategori as keyof typeof icons] || Megaphone;
    return <Icon className="w-5 h-5" />;
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
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
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
                  <p className="text-sm text-gray-600">Total Informasi</p>
                  <h3 className="text-gray-900">{informasiData.length}</h3>
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
                  <p className="text-sm text-gray-600">Aktif</p>
                  <h3 className="text-gray-900">{informasiAktif.length}</h3>
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
                  <p className="text-sm text-gray-600">Arsip</p>
                  <h3 className="text-gray-900">{informasiArsip.length}</h3>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Dibaca</p>
                  <h3 className="text-gray-900">{informasiData.reduce((sum, i) => sum + i.dibaca, 0)}</h3>
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
                  Aktif ({informasiAktif.length})
                </TabsTrigger>
                <TabsTrigger value="arsip">
                  Arsip ({informasiArsip.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="aktif" className="mt-4 space-y-3">
                {informasiAktif.map((info) => (
                  <Card key={info.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3 flex-1">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {getCategoryIcon(info.kategori)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start gap-2 mb-2">
                              <h3 className="text-gray-900 flex-1">{info.judul}</h3>
                              <Badge variant="outline" className={getPriorityBadge(info.prioritas)}>
                                {info.prioritas}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{info.konten}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                                {info.kategori}
                              </Badge>
                              <span>{info.tanggal}</span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {info.dibaca} dibaca
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewDetail(info)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(info)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleArchive(info)}>
                            <Clock className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(info)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {informasiAktif.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Belum ada informasi aktif
                  </div>
                )}
              </TabsContent>

              <TabsContent value="arsip" className="mt-4 space-y-3">
                {informasiArsip.map((info) => (
                  <Card key={info.id} className="hover:shadow-md transition-shadow bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3 flex-1">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            {getCategoryIcon(info.kategori)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start gap-2 mb-2">
                              <h3 className="text-gray-700 flex-1">{info.judul}</h3>
                              <Badge variant="outline" className="bg-gray-100 text-gray-600">
                                Arsip
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{info.konten}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
                                {info.kategori}
                              </Badge>
                              <span>{info.tanggal}</span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {info.dibaca} dibaca
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewDetail(info)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700" onClick={() => handleActivate(info)}>
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(info)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {informasiArsip.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Belum ada informasi arsip
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Buat Pengumuman Baru</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Judul Pengumuman *</Label>
              <Input 
                placeholder="Masukkan judul pengumuman"
                value={formData.judul}
                onChange={(e) => setFormData({...formData, judul: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kategori *</Label>
                <Select value={formData.kategori} onValueChange={(value) => setFormData({...formData, kategori: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Iuran">Iuran</SelectItem>
                    <SelectItem value="Kegiatan">Kegiatan</SelectItem>
                    <SelectItem value="Keamanan">Keamanan</SelectItem>
                    <SelectItem value="Rapat">Rapat</SelectItem>
                    <SelectItem value="Umum">Umum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prioritas</Label>
                <Select value={formData.prioritas} onValueChange={(value) => setFormData({...formData, prioritas: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tinggi">Tinggi</SelectItem>
                    <SelectItem value="Sedang">Sedang</SelectItem>
                    <SelectItem value="Rendah">Rendah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tanggal *</Label>
              <Input 
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Konten Pengumuman *</Label>
              <Textarea 
                placeholder="Masukkan konten pengumuman"
                className="min-h-32"
                value={formData.konten}
                onChange={(e) => setFormData({...formData, konten: e.target.value})}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleAddInformasi}
              >
                <Plus className="w-4 h-4 mr-2" />
                Publikasikan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Edit Pengumuman</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Judul Pengumuman *</Label>
              <Input 
                placeholder="Masukkan judul pengumuman"
                value={formData.judul}
                onChange={(e) => setFormData({...formData, judul: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kategori *</Label>
                <Select value={formData.kategori} onValueChange={(value) => setFormData({...formData, kategori: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Iuran">Iuran</SelectItem>
                    <SelectItem value="Kegiatan">Kegiatan</SelectItem>
                    <SelectItem value="Keamanan">Keamanan</SelectItem>
                    <SelectItem value="Rapat">Rapat</SelectItem>
                    <SelectItem value="Umum">Umum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prioritas</Label>
                <Select value={formData.prioritas} onValueChange={(value) => setFormData({...formData, prioritas: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tinggi">Tinggi</SelectItem>
                    <SelectItem value="Sedang">Sedang</SelectItem>
                    <SelectItem value="Rendah">Rendah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tanggal *</Label>
              <Input 
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Konten Pengumuman *</Label>
              <Textarea 
                placeholder="Masukkan konten pengumuman"
                className="min-h-32"
                value={formData.konten}
                onChange={(e) => setFormData({...formData, konten: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Arsip">Arsip</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleUpdateInformasi}
              >
                <Edit className="w-4 h-4 mr-2" />
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      {selectedInfo && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-2xl" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Detail Pengumuman</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h2 className="text-gray-900 mb-2">{selectedInfo.judul}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                    {selectedInfo.kategori}
                  </Badge>
                  <Badge variant="outline" className={getPriorityBadge(selectedInfo.prioritas)}>
                    {selectedInfo.prioritas}
                  </Badge>
                  <Badge variant="outline" className={
                    selectedInfo.status === "Aktif" 
                      ? "bg-green-100 text-green-700 border-green-300" 
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  }>
                    {selectedInfo.status}
                  </Badge>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedInfo.konten}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Tanggal Publikasi</p>
                  <p className="text-gray-900">{selectedInfo.tanggal}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Total Dibaca</p>
                  <p className="text-gray-900">{selectedInfo.dibaca} warga</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEdit(selectedInfo);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700"
                  onClick={() => {
                    setShowDetailModal(false);
                    handleDelete(selectedInfo);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengumuman</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pengumuman <strong>{selectedInfo?.judul}</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

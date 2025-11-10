import { useState } from "react";
import { Plus, Edit, Trash2, Calendar, Clock, MapPin, Users, Bell } from "lucide-react";
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
import { toast } from "sonner@2.0.3";

interface Jadwal {
  id: number;
  judul: string;
  jenis: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  deskripsi: string;
  status: "Akan Datang" | "Selesai" | "Dibatalkan";
}

export function ManajemenJadwalPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState<Jadwal | null>(null);

  const [jadwalData, setJadwalData] = useState<Jadwal[]>([
    {
      id: 1,
      judul: "Pengangkutan Sampah Zona A",
      jenis: "Sampah",
      tanggal: "2024-11-12",
      waktu: "06:00",
      lokasi: "Zona A (Jl. Melati - Jl. Mawar)",
      deskripsi: "Pengangkutan sampah rutin untuk zona A",
      status: "Akan Datang"
    },
    {
      id: 2,
      judul: "Kerja Bakti Bersama",
      jenis: "Kegiatan",
      tanggal: "2024-11-17",
      waktu: "07:00",
      lokasi: "Area Taman RT 05",
      deskripsi: "Gotong royong membersihkan lingkungan RT",
      status: "Akan Datang"
    },
    {
      id: 3,
      judul: "Rapat RT Bulanan",
      jenis: "Rapat",
      tanggal: "2024-11-20",
      waktu: "19:00",
      lokasi: "Balai RT 05",
      deskripsi: "Rapat rutin bulanan membahas kegiatan RT",
      status: "Akan Datang"
    },
    {
      id: 4,
      judul: "Pengangkutan Sampah Zona B",
      jenis: "Sampah",
      tanggal: "2024-11-05",
      waktu: "06:00",
      lokasi: "Zona B (Jl. Dahlia - Jl. Anggrek)",
      deskripsi: "Pengangkutan sampah rutin untuk zona B",
      status: "Selesai"
    },
  ]);

  const [formData, setFormData] = useState({
    judul: "",
    jenis: "",
    tanggal: "",
    waktu: "",
    lokasi: "",
    deskripsi: "",
    status: "Akan Datang" as const
  });

  const akanDatang = jadwalData.filter(j => j.status === "Akan Datang");
  const selesai = jadwalData.filter(j => j.status === "Selesai");

  const handleEdit = (jadwal: Jadwal) => {
    setSelectedJadwal(jadwal);
    setFormData({
      judul: jadwal.judul,
      jenis: jadwal.jenis,
      tanggal: jadwal.tanggal,
      waktu: jadwal.waktu,
      lokasi: jadwal.lokasi,
      deskripsi: jadwal.deskripsi,
      status: jadwal.status
    });
    setShowEditModal(true);
  };

  const handleDelete = (jadwal: Jadwal) => {
    setSelectedJadwal(jadwal);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedJadwal) {
      setJadwalData(jadwalData.filter(j => j.id !== selectedJadwal.id));
      toast.success("Jadwal berhasil dihapus!");
      setShowDeleteDialog(false);
      setSelectedJadwal(null);
    }
  };

  const handleAddJadwal = () => {
    if (!formData.judul || !formData.jenis || !formData.tanggal || !formData.waktu || !formData.lokasi) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    const newJadwal: Jadwal = {
      id: Math.max(...jadwalData.map(j => j.id)) + 1,
      judul: formData.judul,
      jenis: formData.jenis,
      tanggal: formData.tanggal,
      waktu: formData.waktu,
      lokasi: formData.lokasi,
      deskripsi: formData.deskripsi,
      status: formData.status
    };

    setJadwalData([...jadwalData, newJadwal]);
    toast.success("Jadwal berhasil ditambahkan!");
    setShowAddModal(false);
    resetForm();
  };

  const handleUpdateJadwal = () => {
    if (!selectedJadwal) return;

    if (!formData.judul || !formData.jenis || !formData.tanggal || !formData.waktu || !formData.lokasi) {
      toast.error("Mohon lengkapi semua field!");
      return;
    }

    const updatedData = jadwalData.map(j =>
      j.id === selectedJadwal.id
        ? {
            ...j,
            judul: formData.judul,
            jenis: formData.jenis,
            tanggal: formData.tanggal,
            waktu: formData.waktu,
            lokasi: formData.lokasi,
            deskripsi: formData.deskripsi,
            status: formData.status
          }
        : j
    );

    setJadwalData(updatedData);
    toast.success("Jadwal berhasil diupdate!");
    setShowEditModal(false);
    setSelectedJadwal(null);
    resetForm();
  };

  const handleMarkAsComplete = (jadwal: Jadwal) => {
    const updatedData = jadwalData.map(j =>
      j.id === jadwal.id ? { ...j, status: "Selesai" as const } : j
    );
    setJadwalData(updatedData);
    toast.success("Jadwal ditandai sebagai selesai!");
  };

  const resetForm = () => {
    setFormData({
      judul: "",
      jenis: "",
      tanggal: "",
      waktu: "",
      lokasi: "",
      deskripsi: "",
      status: "Akan Datang"
    });
  };

  const getJenisColor = (jenis: string) => {
    const colors = {
      "Sampah": "bg-green-100 text-green-700 border-green-300",
      "Kegiatan": "bg-blue-100 text-blue-700 border-blue-300",
      "Rapat": "bg-purple-100 text-purple-700 border-purple-300",
      "Lainnya": "bg-gray-100 text-gray-700 border-gray-300"
    };
    return colors[jenis as keyof typeof colors] || colors.Lainnya;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      "Akan Datang": "bg-blue-100 text-blue-700",
      "Selesai": "bg-gray-100 text-gray-700",
      "Dibatalkan": "bg-red-100 text-red-700"
    };
    return colors[status as keyof typeof colors] || colors["Akan Datang"];
  };

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
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Jadwal
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Jadwal</p>
                  <h3 className="text-gray-900">{jadwalData.length}</h3>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Akan Datang</p>
                  <h3 className="text-gray-900">{akanDatang.length}</h3>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sudah Selesai</p>
                  <h3 className="text-gray-900">{selesai.length}</h3>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Jadwal Akan Datang</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {akanDatang.map((jadwal) => (
              <Card key={jadwal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        <h3 className="text-gray-900 flex-1">{jadwal.judul}</h3>
                        <Badge variant="outline" className={getJenisColor(jadwal.jenis)}>
                          {jadwal.jenis}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(jadwal.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{jadwal.waktu} WIB</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{jadwal.lokasi}</span>
                        </div>
                      </div>

                      {jadwal.deskripsi && (
                        <p className="text-sm text-gray-500 mt-2">{jadwal.deskripsi}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleMarkAsComplete(jadwal)}
                      >
                        <Calendar className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(jadwal)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(jadwal)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {akanDatang.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Belum ada jadwal yang akan datang
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Jadwal Selesai</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selesai.map((jadwal) => (
              <Card key={jadwal.id} className="hover:shadow-md transition-shadow bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        <h3 className="text-gray-700 flex-1">{jadwal.judul}</h3>
                        <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
                          {jadwal.jenis}
                        </Badge>
                        <Badge className={getStatusColor(jadwal.status)}>
                          Selesai
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(jadwal.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{jadwal.waktu} WIB</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(jadwal)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {selesai.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Belum ada jadwal yang selesai
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Tambah Jadwal Baru</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Judul Kegiatan *</Label>
              <Input 
                placeholder="Masukkan judul kegiatan"
                value={formData.judul}
                onChange={(e) => setFormData({...formData, judul: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jenis *</Label>
                <Select value={formData.jenis} onValueChange={(value) => setFormData({...formData, jenis: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sampah">Pengangkutan Sampah</SelectItem>
                    <SelectItem value="Kegiatan">Kegiatan Warga</SelectItem>
                    <SelectItem value="Rapat">Rapat RT</SelectItem>
                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Akan Datang">Akan Datang</SelectItem>
                    <SelectItem value="Selesai">Selesai</SelectItem>
                    <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tanggal *</Label>
                <Input 
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Waktu *</Label>
                <Input 
                  type="time"
                  value={formData.waktu}
                  onChange={(e) => setFormData({...formData, waktu: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lokasi *</Label>
              <Input 
                placeholder="Masukkan lokasi kegiatan"
                value={formData.lokasi}
                onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea 
                placeholder="Masukkan deskripsi kegiatan..."
                className="min-h-24"
                value={formData.deskripsi}
                onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
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
                onClick={handleAddJadwal}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Jadwal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Edit Jadwal</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Judul Kegiatan *</Label>
              <Input 
                placeholder="Masukkan judul kegiatan"
                value={formData.judul}
                onChange={(e) => setFormData({...formData, judul: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jenis *</Label>
                <Select value={formData.jenis} onValueChange={(value) => setFormData({...formData, jenis: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sampah">Pengangkutan Sampah</SelectItem>
                    <SelectItem value="Kegiatan">Kegiatan Warga</SelectItem>
                    <SelectItem value="Rapat">Rapat RT</SelectItem>
                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Akan Datang">Akan Datang</SelectItem>
                    <SelectItem value="Selesai">Selesai</SelectItem>
                    <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tanggal *</Label>
                <Input 
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Waktu *</Label>
                <Input 
                  type="time"
                  value={formData.waktu}
                  onChange={(e) => setFormData({...formData, waktu: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lokasi *</Label>
              <Input 
                placeholder="Masukkan lokasi kegiatan"
                value={formData.lokasi}
                onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea 
                placeholder="Masukkan deskripsi kegiatan..."
                className="min-h-24"
                value={formData.deskripsi}
                onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
              />
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
                onClick={handleUpdateJadwal}
              >
                <Edit className="w-4 h-4 mr-2" />
                Update Jadwal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Jadwal</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus jadwal <strong>{selectedJadwal?.judul}</strong>? 
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
